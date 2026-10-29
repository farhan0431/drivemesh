import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { promisify } from 'util';
import { gdriveService } from '../services/gdrive.service';
import { mountService } from '../services/mount.service';
import { config } from '../config';
import { cookie, cookieOptions, createSession, clearSession, randomToken, sessionUserId, sessionCookieName, oauthCookieName } from '../middlewares/session.middleware';
import { Account, AccountModel } from '../models/account.model';
import { pool } from '../database/connection';
import { setupAccount, mountConnectedDrive, removeDrive, connectDrive } from '../services/gateway.service';
const scrypt = promisify(crypto.scrypt) as (password: string, salt: string, length: number) => Promise<Buffer>;
const validPassword = (p: unknown): p is string => typeof p === 'string' && p.length >= 6 && Buffer.byteLength(p, 'utf8') <= 256 && !/[\r\n\0]/.test(p);
const reservedNames = new Set(['global', 'homes', 'drives', 'drivemesh', 'printers', 'netlogon', 'sysvol', 'root', 'nobody', 'con', 'prn', 'aux', 'nul']);
const validUsername = (s: unknown): s is string => typeof s === 'string' && /^[a-z][a-z0-9_]{2,19}$/.test(s) && !s.startsWith('dm') && !reservedNames.has(s);
const dummySalt = '00000000000000000000000000000000';
async function limit(req: Request, username: string): Promise<boolean> {
  const keys = [`ip:${req.ip}`, `user:${username}`].map(v => crypto.createHash('sha256').update(v).digest('hex'));
  for (const [index, key] of keys.entries()) {
    const r = await pool.query(`INSERT INTO auth_attempts (key,attempts,reset_at) VALUES ($1,1,NOW()+interval '15 minutes')
      ON CONFLICT (key) DO UPDATE SET attempts=CASE WHEN auth_attempts.reset_at<NOW() THEN 1 ELSE auth_attempts.attempts+1 END,
      reset_at=CASE WHEN auth_attempts.reset_at<NOW() THEN NOW()+interval '15 minutes' ELSE auth_attempts.reset_at END RETURNING attempts`, [key]);
    if (r.rows[0].attempts > (index === 0 ? 100 : 10)) return false;
  }
  return true;
}
export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { username, password } = req.body || {};
    if (!validUsername(username) || !validPassword(password)) { res.status(400).json({ success: false, error: 'Username harus 3–20 huruf kecil, angka, atau garis bawah dan diawali huruf. Password minimal 6 karakter.' }); return; }
    try {
      if (!await limit(req, username)) { res.status(429).json({ success: false, error: 'Terlalu banyak percobaan. Coba lagi nanti.' }); return; }
      const id = crypto.randomUUID(), salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = `${salt}:${(await scrypt(password, salt, 64)).toString('hex')}`;
      const systemUsername = 'dm' + id.replace(/-/g, '').slice(0, 20);
      let account: Account;
      try { account = (await pool.query('INSERT INTO accounts (id,username,password_hash,system_username) VALUES ($1,$2,$3,$4) RETURNING *', [id, username, passwordHash, systemUsername])).rows[0]; }
      catch (err: any) { if (err.code === '23505') { res.status(409).json({ success: false, error: 'Username tidak tersedia' }); return; } throw err; }
      try { await setupAccount(account, password); }
      catch (err) { await pool.query('DELETE FROM accounts WHERE id=$1', [id]); throw err; }
      await clearSession(req, res); await createSession(res, id); res.status(201).json({ success: true });
    } catch (error) { next(error); }
  }
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { username, password } = req.body || {};
    if (!validUsername(username) || !validPassword(password)) { res.status(401).json({ success: false, error: 'Username atau password salah' }); return; }
    try {
      if (!await limit(req, username)) { res.status(429).json({ success: false, error: 'Terlalu banyak percobaan. Coba lagi nanti.' }); return; }
      const account = await AccountModel.byUsername(username);
      const [salt, expected] = account?.password_hash.split(':') || [dummySalt, '0'.repeat(128)];
      const actual = await scrypt(password, salt, 64);
      if (!account || !/^[a-f0-9]{128}$/.test(expected) || !crypto.timingSafeEqual(actual, Buffer.from(expected, 'hex'))) { res.status(401).json({ success: false, error: 'Username atau password salah' }); return; }
      await clearSession(req, res); await createSession(res, account.id); res.json({ success: true });
    } catch (error) { next(error); }
  }
  static async getAuthUrl(req: Request, res: Response): Promise<void> {
    if (!config.googleClientId || !config.googleClientSecret) { res.status(503).json({ success: false, error: 'Google OAuth belum dikonfigurasi' }); return; }
    const state = randomToken(), verifier = randomToken();
    const binding = crypto.createHash('sha256').update(cookie(req, sessionCookieName)).digest('base64url');
    const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
    for (const [name, value] of [['dm_oauth_state', state], ['dm_oauth_verifier', verifier], ['dm_oauth_binding', binding]]) res.cookie(oauthCookieName(name), value, { ...cookieOptions, maxAge: 600000 });
    res.json({ success: true, url: gdriveService.generateAuthUrl(state, challenge) });
  }
  static async handleCallback(req: Request, res: Response): Promise<void> {
    const state = typeof req.query.state === 'string' ? req.query.state : '';
    const expected = cookie(req, oauthCookieName('dm_oauth_state')), verifier = cookie(req, oauthCookieName('dm_oauth_verifier')), binding = cookie(req, oauthCookieName('dm_oauth_binding'));
    for (const name of ['dm_oauth_state', 'dm_oauth_verifier', 'dm_oauth_binding']) res.clearCookie(oauthCookieName(name), cookieOptions);
    const session = cookie(req, sessionCookieName);
    const expectedBinding = crypto.createHash('sha256').update(session).digest('base64url');
    if (![state, expected, verifier, binding].every(v => /^[A-Za-z0-9_-]{43}$/.test(v)) || !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(expected)) || !crypto.timingSafeEqual(Buffer.from(binding), Buffer.from(expectedBinding))) { res.status(400).send('OAuth state tidak valid'); return; }
    try {
      const id = await sessionUserId(req);
      if (!id) { res.redirect('/login'); return; }
      if (typeof req.query.code !== 'string') { res.redirect('/dashboard?error=google_cancelled'); return; }
      const account = await AccountModel.byId(id);
      if (!account) throw new Error('Account not found');
      const mounted = await connectDrive(account, req.query.code, verifier);
      res.redirect(mounted ? '/dashboard?connected=1' : '/dashboard?error=mount_failed');
    } catch (error) { console.error('Google connection failed:', error instanceof Error ? error.message : 'unknown error'); res.redirect('/dashboard?error=google_failed'); }
  }
  static async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = await sessionUserId(req); const account = id ? await AccountModel.byId(id) : null;
      res.json({ success: true, data: account ? { authenticated: true, username: account.username } : { authenticated: false } });
    } catch (error) { next(error); }
  }
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> { try { await clearSession(req, res); res.json({ success: true }); } catch (error) { next(error); } }
  static async drives(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const account = await AccountModel.byId(res.locals.userId); if (!account) { res.status(401).end(); return; }
      const drives = (await AccountModel.drives(account.id)).map(d => ({ id: d.id, email: d.email, name: d.display_name, folderName: d.folder_name, mounted: mountService.isMounted(account, d) }));
      res.json({ success: true, data: drives });
    } catch (error) { next(error); }
  }
  static async mount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const driveId = req.params.id;
      if (typeof driveId !== 'string' || !/^[a-f0-9-]{36}$/.test(driveId)) { res.status(404).json({ success: false, error: 'Drive tidak ditemukan' }); return; }
      const account = await AccountModel.byId(res.locals.userId), drive = account && await AccountModel.drive(driveId, account.id);
      if (!account || !drive) { res.status(404).json({ success: false, error: 'Drive tidak ditemukan' }); return; }
      await mountConnectedDrive(account, drive); res.json({ success: true });
    } catch (error) { next(error); }
  }
  static async disconnect(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const driveId = req.params.id;
      if (typeof driveId !== 'string' || !/^[a-f0-9-]{36}$/.test(driveId)) { res.status(404).json({ success: false, error: 'Drive tidak ditemukan' }); return; }
      const account = await AccountModel.byId(res.locals.userId), drive = account && await AccountModel.drive(driveId, account.id);
      if (!account || !drive) { res.status(404).json({ success: false, error: 'Drive tidak ditemukan' }); return; }
      await removeDrive(account, drive);
      res.json({ success: true });
    } catch (error) { next(error); }
  }
}
