import { execFileSync, execFile } from 'child_process';
import { promisify } from 'util';
const execFileAsync = promisify(execFile);
import fs from 'fs';
import path from 'path';
import { config } from '../config';
import { Account, Drive } from '../models/account.model';
import { decryptSecret } from '../utils/vault.util';
import { google } from 'googleapis';
import { isSafeFolderName } from '../utils/folderName.util';

export class MountService {
  private readonly configDir = '/run/drivemesh/rclone';
  private readonly cacheDir = '/var/lib/drivemesh/cache';
  accountPath(account: Account): string {
    if (!/^dm[a-f0-9]{20}$/.test(account.system_username)) throw new Error('Invalid account identity');
    return path.join(config.mountPoint, account.system_username);
  }
  mountPath(account: Account, drive: Drive): string {
    if (drive.account_id !== account.id || !isSafeFolderName(drive.folder_name)) throw new Error('Invalid drive path');
    return path.join(this.accountPath(account), drive.folder_name);
  }
  private configPath(drive: Drive): string { return path.join(this.configDir, `${drive.id}.conf`); }
  prepareAccount(account: Account): void {
    fs.mkdirSync(config.mountPoint, { recursive: true, mode: 0o711 });
    fs.chmodSync(config.mountPoint, 0o711);
    fs.mkdirSync(this.accountPath(account), { recursive: true, mode: 0o550 });
    const gid = Number(execFileSync('id', ['-g', account.system_username], { encoding: 'utf8' }).trim());
    if (!Number.isInteger(gid) || gid <= 0) throw new Error('Invalid account group');
    fs.chownSync(this.accountPath(account), 0, gid);
    fs.chmodSync(this.accountPath(account), 0o550);
  }
  isMounted(account: Account, drive: Drive): boolean {
    try { const target = this.mountPath(account, drive); return fs.readFileSync('/proc/self/mountinfo', 'utf8').split('\n').some(line => line.split(' ')[4]?.replace(/\\040/g, ' ') === target); } catch { return false; }
  }
  unmount(account: Account, drive: Drive): void {
    const target = this.mountPath(account, drive);
    if (this.isMounted(account, drive)) {
      execFileSync('fusermount3', ['-u', target], { stdio: 'ignore', timeout: 15000 });
      if (this.isMounted(account, drive)) throw new Error('Unmount gagal');
    }
    try { fs.rmdirSync(target); } catch (e: any) { if (e.code !== 'ENOENT') throw e; }
    try { fs.unlinkSync(this.configPath(drive)); } catch (e: any) { if (e.code !== 'ENOENT') throw e; }
  }
  async mountDrive(account: Account, drive: Drive): Promise<void> {
    if (this.isMounted(account, drive)) return;
    if ([config.googleClientId, config.googleClientSecret].some(v => /[\r\n]/.test(v))) throw new Error('Invalid OAuth configuration');
    fs.mkdirSync(this.configDir, { recursive: true, mode: 0o700 });
    this.prepareAccount(account);
    const target = this.mountPath(account, drive);
    if (!/^[a-f0-9-]{36}$/.test(drive.id)) throw new Error('Invalid drive identity');
    const cachePath = path.join(this.cacheDir, drive.id);
    fs.mkdirSync(cachePath, { recursive: true, mode: 0o700 });
    fs.chmodSync(this.cacheDir, 0o700);
    fs.chmodSync(cachePath, 0o700);
    fs.mkdirSync(target, { recursive: true, mode: 0o700 });
    const uid = execFileSync('id', ['-u', account.system_username], { encoding: 'utf8' }).trim();
    const gid = execFileSync('id', ['-g', account.system_username], { encoding: 'utf8' }).trim();
    const refreshToken = decryptSecret({ cipherText: drive.refresh_token_enc, iv: drive.iv, authTag: drive.auth_tag });
    const oauth = new google.auth.OAuth2(config.googleClientId, config.googleClientSecret, config.googleRedirectUri);
    oauth.setCredentials({ refresh_token: refreshToken });
    const access = await oauth.getAccessToken();
    if (!access.token) throw new Error('Google tidak memberikan access token');
    const token = JSON.stringify({ access_token: access.token, token_type: 'Bearer', refresh_token: refreshToken, expiry: new Date(oauth.credentials.expiry_date || Date.now() + 300000).toISOString() });
    const body = `[drivemesh]\ntype = drive\nclient_id = ${config.googleClientId}\nclient_secret = ${config.googleClientSecret}\nscope = drive\ntoken = ${token}\n`;
    fs.writeFileSync(this.configPath(drive), body, { mode: 0o600 });
    fs.chmodSync(this.configPath(drive), 0o600);
    try {
      await execFileAsync('rclone', ['mount', 'drivemesh:', target, `--config=${this.configPath(drive)}`, '--vfs-cache-mode=writes', `--cache-dir=${cachePath}`, '--vfs-write-back=0s', '--vfs-cache-max-age=1h', '--vfs-cache-max-size=4G', '--allow-other', '--default-permissions', `--uid=${uid}`, `--gid=${gid}`, '--umask=077', '--dir-cache-time=5m', '--poll-interval=1m', '--daemon', '--daemon-wait=20s'], { timeout: 30000 });
      if (!this.isMounted(account, drive)) throw new Error('Mount Drive tidak aktif');
    } catch (error) {
      try { fs.rmdirSync(target); } catch { /* retain inaccessible root-owned directory */ }
      try { fs.unlinkSync(this.configPath(drive)); } catch { /* no config to remove */ }
      throw error;
    }
  }
}
export const mountService = new MountService();
