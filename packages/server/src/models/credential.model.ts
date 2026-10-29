import { pool } from '../database/connection';

export interface StoredCredentials {
  id: number;
  username: string;
  password_hash: string;
  updated_at: string;
}

export class CredentialModel {
  static async get(): Promise<StoredCredentials | null> {
    const res = await pool.query('SELECT * FROM network_credentials WHERE id = 1');
    return res.rows[0] || null;
  }

  static async upsert(username: string, passwordHash: string): Promise<void> {
    const query = `
      INSERT INTO network_credentials (id, username, password_hash, updated_at)
      VALUES (1, $1, $2, NOW())
      ON CONFLICT(id) DO UPDATE SET
        username = EXCLUDED.username,
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW()
    `;
    await pool.query(query, [username, passwordHash]);
  }
}
