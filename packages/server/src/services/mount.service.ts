import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { config } from '../config';
import { OAuthTokenModel } from '../models/oauthToken.model';
import { decryptSecret } from '../utils/vault.util';

export class MountService {
  private rcloneConfDir = path.resolve(__dirname, '../../.config');
  private rcloneConfPath = path.resolve(this.rcloneConfDir, 'rclone.conf');

  isMounted(): boolean {
    try {
      const mounts = fs.readFileSync('/proc/mounts', 'utf8');
      return mounts.includes(config.mountPoint);
    } catch {
      return false;
    }
  }

  unmount(): boolean {
    if (this.isMounted()) {
      try {
        execSync(`fusermount3 -u ${config.mountPoint}`, { stdio: 'ignore' });
        console.log(`Unmounted ${config.mountPoint}`);
        return true;
      } catch {
        try {
          execSync(`sudo umount -l ${config.mountPoint}`, { stdio: 'ignore' });
          return true;
        } catch {
          return false;
        }
      }
    }
    return true;
  }

  async mountDrive(): Promise<boolean> {
    const tokenRecord = await OAuthTokenModel.findByProvider('google');
    if (!tokenRecord) {
      console.warn('Cannot mount: No Google OAuth token in database.');
      return false;
    }

    const refreshToken = decryptSecret({
      cipherText: tokenRecord.refresh_token_enc,
      iv: tokenRecord.iv,
      authTag: tokenRecord.auth_tag,
    });

    if (!fs.existsSync(this.rcloneConfDir)) {
      fs.mkdirSync(this.rcloneConfDir, { recursive: true });
    }
    if (!fs.existsSync(config.mountPoint)) {
      fs.mkdirSync(config.mountPoint, { recursive: true });
    }

    const tokenJson = JSON.stringify({
      access_token: tokenRecord.access_token || '',
      token_type: 'Bearer',
      refresh_token: refreshToken,
      expiry: new Date(tokenRecord.expiry_date ? Number(tokenRecord.expiry_date) : Date.now() + 3600000).toISOString(),
    });

    const rcloneConfContent = `
[drivemesh]
type = drive
client_id = ${config.googleClientId}
client_secret = ${config.googleClientSecret}
scope = drive
token = ${tokenJson}
`;

    fs.writeFileSync(this.rcloneConfPath, rcloneConfContent.trim(), { mode: 0o600 });
    this.unmount();

    const args = [
      'mount',
      'drivemesh:',
      config.mountPoint,
      `--config=${this.rcloneConfPath}`,
      '--vfs-cache-mode=off',
      '--allow-other',
      '--dir-cache-time=1m',
      '--poll-interval=1m',
      '--read-only=false',
      '--daemon',
    ];

    try {
      execSync(`rclone ${args.join(' ')}`, { stdio: 'inherit' });
      console.log(`✅ Mounted Google Drive at ${config.mountPoint} (Zero Local Storage)`);
      return true;
    } catch (err) {
      console.error('Failed to mount Google Drive via rclone:', err);
      return false;
    }
  }
}

export const mountService = new MountService();
