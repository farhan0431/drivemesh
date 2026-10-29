import { pool } from '../database/connection';
export interface Account { id: string; username: string; password_hash: string; system_username: string; smb_enabled: boolean }
export interface Drive { id: string; account_id: string; google_sub: string; email: string; display_name: string | null; folder_name: string; refresh_token_enc: string; iv: string; auth_tag: string }
export class AccountModel {
  static async byId(id: string): Promise<Account | null> { return (await pool.query('SELECT * FROM accounts WHERE id=$1', [id])).rows[0] || null; }
  static async byUsername(username: string): Promise<Account | null> { return (await pool.query('SELECT * FROM accounts WHERE username=$1', [username])).rows[0] || null; }
  static async all(): Promise<Account[]> { return (await pool.query('SELECT * FROM accounts ORDER BY id')).rows; }
  static async setEnabled(id: string, enabled: boolean): Promise<void> { await pool.query('UPDATE accounts SET smb_enabled=$2 WHERE id=$1', [id, enabled]); }
  static async drives(id: string): Promise<Drive[]> { return (await pool.query('SELECT * FROM connected_drives WHERE account_id=$1 ORDER BY created_at', [id])).rows; }
  static async drive(id: string, accountId: string): Promise<Drive | null> { return (await pool.query('SELECT * FROM connected_drives WHERE id=$1 AND account_id=$2', [id, accountId])).rows[0] || null; }
}
