import { pool } from '../database/connection';

export interface StoredOAuthToken {
  provider: string;
  access_token: string | null;
  refresh_token_enc: string;
  iv: string;
  auth_tag: string;
  expiry_date: number | null;
  user_email: string | null;
  user_name: string | null;
  user_picture: string | null;
  updated_at: string;
}

export class OAuthTokenModel {
  static async findByProvider(provider = 'google'): Promise<StoredOAuthToken | null> {
    const res = await pool.query('SELECT * FROM oauth_tokens WHERE provider = $1', [provider]);
    return res.rows[0] || null;
  }

  static async upsert(token: Omit<StoredOAuthToken, 'updated_at'>): Promise<void> {
    const query = `
      INSERT INTO oauth_tokens (provider, access_token, refresh_token_enc, iv, auth_tag, expiry_date, user_email, user_name, user_picture, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      ON CONFLICT(provider) DO UPDATE SET
        access_token = EXCLUDED.access_token,
        refresh_token_enc = EXCLUDED.refresh_token_enc,
        iv = EXCLUDED.iv,
        auth_tag = EXCLUDED.auth_tag,
        expiry_date = EXCLUDED.expiry_date,
        user_email = EXCLUDED.user_email,
        user_name = EXCLUDED.user_name,
        user_picture = EXCLUDED.user_picture,
        updated_at = NOW()
      WHERE oauth_tokens.user_email = EXCLUDED.user_email
    `;
    const result = await pool.query(query, [
      token.provider,
      token.access_token,
      token.refresh_token_enc,
      token.iv,
      token.auth_tag,
      token.expiry_date,
      token.user_email,
      token.user_name,
      token.user_picture,
    ]);
    if (result.rowCount !== 1) throw new Error('Akun Google lain sudah terhubung');
  }

  static async deleteByProvider(provider = 'google'): Promise<void> {
    await pool.query('DELETE FROM oauth_tokens WHERE provider = $1', [provider]);
  }
}
