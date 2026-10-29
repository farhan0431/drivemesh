import { pool } from '../database/connection';

export interface DriveUser {
  id: string; google_sub: string; email: string; name: string | null; picture: string | null;
  refresh_token_enc: string; iv: string; auth_tag: string; smb_username: string; smb_enabled: boolean;
}
export class UserModel {
  static async findById(id: string): Promise<DriveUser | null> {
    const result = await pool.query('SELECT * FROM dm_users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }
  static async findBySubject(sub: string): Promise<DriveUser | null> {
    const result = await pool.query('SELECT * FROM dm_users WHERE google_sub = $1', [sub]);
    return result.rows[0] || null;
  }
  static async all(): Promise<DriveUser[]> { return (await pool.query('SELECT * FROM dm_users ORDER BY id')).rows; }
  static async setEnabled(id: string, enabled: boolean): Promise<void> { await pool.query('UPDATE dm_users SET smb_enabled = $2 WHERE id = $1', [id, enabled]); }
}
