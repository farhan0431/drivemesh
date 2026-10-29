import path from 'path';
import dotenv from 'dotenv';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'production',
  port: parseInt(process.env.PORT || '5080', 10),
  domain: process.env.DOMAIN || 'drivemesh.farhan-dev.my.id',
  protocol: process.env.NODE_ENV === 'development' ? 'http' : 'https',
  
  // Google OAuth2
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  get googleRedirectUri(): string {
    return `${this.protocol}://${this.domain}/api/auth/google/callback`;
  },

  // Security Master Key (AES-256-GCM)
  masterKey: process.env.MASTER_KEY || 'drivemesh-enterprise-vault-secure-master-key-32b!',

  // PostgreSQL Connection String
  databaseUrl: process.env.DATABASE_URL || 'postgresql://drivemesh:drivemesh_secure_pass@localhost:5434/drivemesh',

  // Mount & Share
  mountPoint: process.env.MOUNT_POINT || '/mnt/drivemesh/gdrive',
  sambaShareName: process.env.SAMBA_SHARE_NAME || 'gdrive',
};
