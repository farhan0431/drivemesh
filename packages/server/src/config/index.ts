import path from 'path';
import dotenv from 'dotenv';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'production',
  port: parseInt(process.env.PORT || '5080', 10),
  listenHost: process.env.LISTEN_HOST || '127.0.0.1',
  domain: process.env.DOMAIN || 'drivemesh.farhan-dev.my.id',
  protocol: process.env.NODE_ENV === 'development' ? 'http' : 'https',
  smbHost: process.env.SMB_HOST || (process.env.DOMAIN || 'localhost').split(':')[0],
  
  // Google OAuth2
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  get googleRedirectUri(): string {
    return `${this.protocol}://${this.domain}/api/auth/google/callback`;
  },

  // Security Master Key (AES-256-GCM)
  masterKey: process.env.MASTER_KEY || '',

  // PostgreSQL Connection String
  databaseUrl: process.env.DATABASE_URL || '',

  // Mount & Share
  mountPoint: process.env.MOUNT_POINT || '/mnt/drivemesh/users',
  sambaShareName: process.env.SAMBA_SHARE_NAME || 'gdrive',
};
