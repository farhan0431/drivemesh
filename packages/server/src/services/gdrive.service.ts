import crypto from 'crypto';
import { google, Auth } from 'googleapis';
import { config } from '../config';
import { pool } from '../database/connection';
import { Drive } from '../models/account.model';
import { encryptSecret, decryptSecret } from '../utils/vault.util';
import { makeFolderName } from '../utils/folderName.util';
export class GoogleDriveService {
  private client() { return new google.auth.OAuth2(config.googleClientId, config.googleClientSecret, config.googleRedirectUri); }
  generateAuthUrl(state: string, challenge: string): string {
    return this.client().generateAuthUrl({ state, code_challenge: challenge, code_challenge_method: Auth.CodeChallengeMethod.S256,
      access_type: 'offline', prompt: 'consent', scope: ['openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/drive'] });
  }
  async connect(code: string, verifier: string, accountId: string): Promise<Drive> {
    const client = this.client();
    const { tokens } = await client.getToken({ code, codeVerifier: verifier });
    if (!tokens.id_token) throw new Error('Google tidak mengembalikan identitas');
    const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: config.googleClientId });
    const identity = ticket.getPayload();
    if (!identity?.sub || !identity.email || !identity.email_verified) throw new Error('Identitas Google tidak terverifikasi');
    const existing = (await pool.query('SELECT * FROM connected_drives WHERE google_sub=$1', [identity.sub])).rows[0] as Drive | undefined;
    if (existing && existing.account_id !== accountId) throw new Error('Akun Google ini sudah terhubung ke akun DriveMesh lain');
    if (!tokens.refresh_token && !existing) throw new Error('Google tidak mengembalikan izin akses offline');
    const encrypted = tokens.refresh_token ? encryptSecret(tokens.refresh_token) : { cipherText: existing!.refresh_token_enc, iv: existing!.iv, authTag: existing!.auth_tag };
    const id = crypto.randomUUID();
    const current = await pool.query('SELECT folder_name FROM connected_drives WHERE account_id=$1', [accountId]);
    const folderName = makeFolderName(identity.name, identity.email, current.rows.map(row => row.folder_name));
    const result = await pool.query(`INSERT INTO connected_drives (id,account_id,google_sub,email,display_name,folder_name,refresh_token_enc,iv,auth_tag)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (google_sub) DO UPDATE SET email=EXCLUDED.email,display_name=EXCLUDED.display_name,
        refresh_token_enc=EXCLUDED.refresh_token_enc,iv=EXCLUDED.iv,auth_tag=EXCLUDED.auth_tag
      WHERE connected_drives.account_id=EXCLUDED.account_id RETURNING *`,
      [id, accountId, identity.sub, identity.email, identity.name || null, folderName, encrypted.cipherText, encrypted.iv, encrypted.authTag]);
    if (!result.rowCount) throw new Error('Akun Google ini sudah terhubung ke akun DriveMesh lain');
    return result.rows[0];
  }
  async revoke(drive: Drive): Promise<void> {
    const refresh = decryptSecret({ cipherText: drive.refresh_token_enc, iv: drive.iv, authTag: drive.auth_tag });
    await this.client().revokeToken(refresh);
  }
}
export const gdriveService = new GoogleDriveService();
