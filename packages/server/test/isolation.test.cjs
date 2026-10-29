// Integration test against a disposable PostgreSQL database; no real Samba or Google calls.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { once } = require('node:events');
const database = process.env.TEST_DATABASE_URL;
if (!database || !/test/i.test(new URL(database).pathname)) throw new Error('TEST_DATABASE_URL must point to a disposable database with test in its name');
process.env.DATABASE_URL = database;
process.env.NODE_ENV = 'development';
process.env.DOMAIN = 'localhost:3080';
process.env.MASTER_KEY = 'integration-test-only-master-key-32-characters';
process.env.GOOGLE_CLIENT_ID = 'test-client';
process.env.GOOGLE_CLIENT_SECRET = 'test-secret';
const { pool, initDatabase } = require('../dist/database/connection');
const gateway = require('../dist/services/gateway.service');
gateway.setupAccount = async account => { await pool.query('UPDATE accounts SET smb_enabled=true WHERE id=$1', [account.id]); };
gateway.mountConnectedDrive = async () => {};
const { mountService } = require('../dist/services/mount.service');
mountService.mountDrive = async () => {};
mountService.isMounted = () => false;
gateway.removeDrive = async (account, drive) => { await pool.query('DELETE FROM connected_drives WHERE id=$1 AND account_id=$2', [drive.id, account.id]); };
const { gdriveService } = require('../dist/services/gdrive.service');
gdriveService.revoke = async () => {};
const { google } = require('googleapis');
const OAuth = google.auth.OAuth2;
const previousToken = OAuth.prototype.getToken, previousVerify = OAuth.prototype.verifyIdToken;
OAuth.prototype.getToken = async ({ code, codeVerifier }) => { assert.match(codeVerifier, /^[\w-]{43}$/); return { tokens: { id_token: code, refresh_token: `refresh-${code}` } }; };
OAuth.prototype.verifyIdToken = async ({ idToken }) => ({ getPayload: () => ({ sub: idToken, email: `${idToken}@example.test`, email_verified: true, name: idToken }) });
const { createApp } = require('../dist/app');
function agent(base) {
  const cookies = new Map();
  return async (path, options = {}) => {
    const headers = { Origin: 'http://localhost:3080', ...options.headers };
    if (cookies.size) headers.Cookie = [...cookies].map(([k,v]) => `${k}=${v}`).join('; ');
    if (options.body) headers['Content-Type'] = 'application/json';
    const response = await fetch(base + path, { method: options.method || 'GET', headers, body: options.body ? JSON.stringify(options.body) : undefined, redirect: 'manual' });
    for (const value of response.headers.getSetCookie()) { const [pair] = value.split(';'), i = pair.indexOf('='); const key = pair.slice(0, i), val = pair.slice(i+1); if (val) cookies.set(key,val); else cookies.delete(key); }
    return response;
  };
}
test('accounts isolate sessions, OAuth state and Drive ownership', async () => {
  await initDatabase();
  const server = createApp().listen(0, '127.0.0.1'); await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const a = agent(base), b = agent(base), anonymous = agent(base);
  const suffix = crypto.randomBytes(4).toString('hex');
  const alice = `a${suffix}`, bob = `b${suffix}`;
  try {
    assert.equal((await anonymous('/api/credentials')).status, 401);
    assert.equal((await anonymous('/api/auth/register', {method:'POST',body:{username:'short'+suffix,password:'abc12'}})).status, 400);
    assert.equal((await anonymous('/api/auth/register', {method:'POST',body:{username:'global',password:'long-test-password-invalid'}})).status, 400);
    assert.equal((await a('/api/auth/register', { method:'POST', body:{username:alice,password:'abc123'} })).status, 201);
    assert.equal((await b('/api/auth/register', { method:'POST', body:{username:bob,password:'long-test-password-bob'} })).status, 201);
    const aliceId = (await pool.query('SELECT id FROM accounts WHERE username=$1', [alice])).rows[0].id;
    await pool.query(`INSERT INTO connected_drives (id,account_id,google_sub,email,display_name,folder_name,refresh_token_enc,iv,auth_tag)
      VALUES ($1,$3,$4,'one@example.test','Nama Sama','one@example.test-aaaaaaaa','x','x','x'),
             ($2,$3,$5,'two@example.test','Nama Sama','two@example.test-bbbbbbbb','x','x','x')`,
      ['aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', aliceId, `legacy1${suffix}`, `legacy2${suffix}`]);
    await initDatabase();
    const migrated = await pool.query('SELECT folder_name FROM connected_drives WHERE account_id=$1 ORDER BY folder_name', [aliceId]);
    assert.deepEqual(migrated.rows.map(row => row.folder_name), ['Google Drive - Nama Sama', 'Google Drive - Nama Sama (2)']);
    await pool.query('DELETE FROM connected_drives WHERE account_id=$1', [aliceId]);

    assert.equal((await anonymous('/api/auth/login', {method:'POST',body:{username:alice,password:'wrong-test-password'}})).status, 401);
    assert.equal((await a('/api/auth/logout', {method:'POST',headers:{Origin:'http://attacker.test'}})).status, 403);
    async function link(client, sub) {
      const start = await client('/api/auth/google/url'); assert.equal(start.status, 200);
      const url = new URL((await start.json()).url); assert.equal(url.searchParams.get('code_challenge_method'), 'S256');
      return client(`/api/auth/google/callback?state=${encodeURIComponent(url.searchParams.get('state'))}&code=${encodeURIComponent(sub)}`);
    }
    assert.equal((await a('/api/auth/google/callback?state=bad&code=bad')).status, 400);
    const aStart = await a('/api/auth/google/url');
    const aState = new URL((await aStart.json()).url).searchParams.get('state');
    await b('/api/auth/google/url');
    assert.equal((await b(`/api/auth/google/callback?state=${aState}&code=invalid`)).status, 400);
    assert.equal((await link(a, `alice1${suffix}`)).headers.get('location'), '/dashboard?connected=1');
    assert.equal((await link(a, `alice2${suffix}`)).headers.get('location'), '/dashboard?connected=1');
    assert.equal((await link(b, `bob1${suffix}`)).headers.get('location'), '/dashboard?connected=1');
    assert.equal((await link(b, `alice1${suffix}`)).headers.get('location'), '/dashboard?error=google_failed');
    const aDrives = (await (await a('/api/auth/drives')).json()).data;
    const bDrives = (await (await b('/api/auth/drives')).json()).data;
    assert.equal(aDrives.length, 2); assert.equal(bDrives.length, 1);
    assert.equal((await b(`/api/auth/drives/${aDrives[0].id}`, {method:'DELETE'})).status, 404);
    assert.equal((await b(`/api/auth/drives/${aDrives[0].id}/mount`, {method:'POST'})).status, 404);
    assert.equal((await a(`/api/auth/drives/${aDrives[0].id}`, {method:'DELETE'})).status, 200);
    assert.equal((await (await a('/api/auth/drives')).json()).data.length, 1);
    assert.equal((await (await b('/api/auth/drives')).json()).data.length, 1);
    assert.equal((await a('/api/auth/logout', {method:'POST'})).status, 200);
    assert.equal((await a('/api/auth/drives')).status, 401);
    assert.equal((await a('/api/auth/login', {method:'POST',body:{username:alice,password:'abc123'}})).status, 200);
    assert.equal((await b('/api/auth/drives')).status, 200);
  } finally {
    await pool.query('DELETE FROM accounts WHERE username=ANY($1)', [[alice,bob]]);
    server.close(); await pool.end(); OAuth.prototype.getToken = previousToken; OAuth.prototype.verifyIdToken = previousVerify;
  }
});
