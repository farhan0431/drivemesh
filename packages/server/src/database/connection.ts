import { Pool } from 'pg';
import { config } from '../config';
import { makeFolderName } from '../utils/folderName.util';
export const pool = new Pool({ connectionString: config.databaseUrl, max: 10, idleTimeoutMillis: 30000, connectionTimeoutMillis: 5000 });
export async function initDatabase(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (
      id UUID PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      system_username VARCHAR(32) UNIQUE NOT NULL,
      smb_enabled BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS account_sessions (
      token_hash VARCHAR(64) PRIMARY KEY,
      account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL
    );
    CREATE INDEX IF NOT EXISTS account_sessions_account_id ON account_sessions(account_id);
    CREATE TABLE IF NOT EXISTS auth_attempts (
      key TEXT PRIMARY KEY,
      attempts INTEGER NOT NULL,
      reset_at TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS connected_drives (
      id UUID PRIMARY KEY,
      account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      google_sub TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      display_name TEXT,
      folder_name VARCHAR(64) NOT NULL,
      refresh_token_enc TEXT NOT NULL,
      iv TEXT NOT NULL,
      auth_tag TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (account_id, folder_name)
    );
    CREATE INDEX IF NOT EXISTS connected_drives_account_id ON connected_drives(account_id);
  `);
  // Older versions used email plus a random suffix; only those legacy names are migrated.
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT id, account_id, email, display_name, folder_name FROM connected_drives ORDER BY account_id, created_at, id FOR UPDATE');
    const used = new Map<string, string[]>();
    for (const row of rows) {
      if (!/^[a-z0-9@._-]+-[a-f0-9]{8}$/.test(row.folder_name)) {
        const names = used.get(row.account_id) || []; names.push(row.folder_name); used.set(row.account_id, names);
      }
    }
    for (const row of rows) {
      if (!/^[a-z0-9@._-]+-[a-f0-9]{8}$/.test(row.folder_name)) continue;
      const names = used.get(row.account_id) || [];
      const name = makeFolderName(row.display_name, row.email, names);
      await client.query('UPDATE connected_drives SET folder_name=$1 WHERE id=$2', [name, row.id]);
      names.push(name); used.set(row.account_id, names);
    }
    await client.query('COMMIT');
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
