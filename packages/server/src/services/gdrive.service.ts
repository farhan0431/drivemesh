import { google } from 'googleapis';
import { config } from '../config';
import { OAuthTokenModel } from '../models/oauthToken.model';
import { encryptSecret, decryptSecret } from '../utils/vault.util';
import { formatBytes } from '../utils/formatters.util';

export class GoogleDriveService {
  private createOAuthClient() {
    return new google.auth.OAuth2(
      config.googleClientId,
      config.googleClientSecret,
      config.googleRedirectUri
    );
  }

  generateAuthUrl(): string {
    const oauth2Client = this.createOAuthClient();
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/drive',
      ],
    });
  }

  async handleCallback(code: string): Promise<{ email: string; name: string }> {
    const oauth2Client = this.createOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    const refreshToken = tokens.refresh_token;
    if (!refreshToken) {
      const existing = await OAuthTokenModel.findByProvider('google');
      if (!existing) {
        throw new Error('Google did not return a refresh_token. Silakan coba lagi.');
      }
    } else {
      const encrypted = encryptSecret(refreshToken);
      await OAuthTokenModel.upsert({
        provider: 'google',
        access_token: tokens.access_token || null,
        refresh_token_enc: encrypted.cipherText,
        iv: encrypted.iv,
        auth_tag: encrypted.authTag,
        expiry_date: tokens.expiry_date || null,
        user_email: userInfo.data.email || null,
        user_name: userInfo.data.name || null,
        user_picture: userInfo.data.picture || null,
      });
    }

    return {
      email: userInfo.data.email || 'unknown',
      name: userInfo.data.name || 'User',
    };
  }

  async getAuthenticatedClient() {
    const tokenRecord = await OAuthTokenModel.findByProvider('google');
    if (!tokenRecord) return null;

    const refreshToken = decryptSecret({
      cipherText: tokenRecord.refresh_token_enc,
      iv: tokenRecord.iv,
      authTag: tokenRecord.auth_tag,
    });

    const oauth2Client = this.createOAuthClient();
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
      access_token: tokenRecord.access_token || undefined,
      expiry_date: tokenRecord.expiry_date ? Number(tokenRecord.expiry_date) : undefined,
    });

    oauth2Client.on('tokens', async (newTokens) => {
      const updatedEnc = newTokens.refresh_token
        ? encryptSecret(newTokens.refresh_token)
        : { cipherText: tokenRecord.refresh_token_enc, iv: tokenRecord.iv, authTag: tokenRecord.auth_tag };

      await OAuthTokenModel.upsert({
        provider: 'google',
        access_token: newTokens.access_token || tokenRecord.access_token,
        refresh_token_enc: updatedEnc.cipherText,
        iv: updatedEnc.iv,
        auth_tag: updatedEnc.authTag,
        expiry_date: newTokens.expiry_date || (tokenRecord.expiry_date ? Number(tokenRecord.expiry_date) : null),
        user_email: tokenRecord.user_email,
        user_name: tokenRecord.user_name,
        user_picture: tokenRecord.user_picture,
      });
    });

    return oauth2Client;
  }

  async getStatus() {
    const tokenRecord = await OAuthTokenModel.findByProvider('google');
    if (!tokenRecord) {
      return { connected: false };
    }

    try {
      const auth = await this.getAuthenticatedClient();
      if (!auth) return { connected: false };

      const drive = google.drive({ version: 'v3', auth });
      const about = await drive.about.get({ fields: 'user,storageQuota' });

      const quota = about.data.storageQuota;
      const limitBytes = parseInt(quota?.limit || '0', 10);
      const usageBytes = parseInt(quota?.usage || '0', 10);
      const usagePercent = limitBytes > 0 ? Math.round((usageBytes / limitBytes) * 100) : 0;

      return {
        connected: true,
        email: tokenRecord.user_email || about.data.user?.emailAddress || undefined,
        name: tokenRecord.user_name || about.data.user?.displayName || undefined,
        picture: tokenRecord.user_picture || about.data.user?.photoLink || undefined,
        quota: {
          limitBytes,
          usageBytes,
          usagePercent,
          limitFormatted: formatBytes(limitBytes),
          usageFormatted: formatBytes(usageBytes),
        },
      };
    } catch {
      return {
        connected: true,
        email: tokenRecord.user_email || undefined,
        name: tokenRecord.user_name || undefined,
        picture: tokenRecord.user_picture || undefined,
      };
    }
  }

  async disconnect(): Promise<void> {
    await OAuthTokenModel.deleteByProvider('google');
  }
}

export const gdriveService = new GoogleDriveService();
