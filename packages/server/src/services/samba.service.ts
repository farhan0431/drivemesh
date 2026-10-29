import { execFileSync } from 'child_process';
import fs from 'fs';
import { Account } from '../models/account.model';
import { config } from '../config';
import { mountService } from './mount.service';
const sambaConfig = '/run/drivemesh/smb.conf';
const usernameMap = '/run/drivemesh/username.map';
function run(command: string, args: string[], input?: string): string {
  return execFileSync(command, args, { input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 30000 });
}
export class SambaService {
  ensureGroup(): void {
    try { run('getent', ['group', 'drivemesh']); }
    catch { run('groupadd', ['drivemesh']); }
  }
  ensureUser(account: Account): void {
    this.ensureGroup();
    if (!/^dm[a-f0-9]{20}$/.test(account.system_username)) throw new Error('Identitas SMB tidak valid');
    try { run('id', ['-u', account.system_username]); }
    catch { run('useradd', ['-U', '-M', '-s', '/usr/sbin/nologin', account.system_username]); }
    run('usermod', ['-a', '-G', 'drivemesh', account.system_username]);
  }
  setPassword(account: Account, password: string): void {
    this.ensureUser(account);
    run('smbpasswd', ['-c', sambaConfig, '-s', '-a', account.system_username], `${password}\n${password}\n`);
  }
  closeShare(account: Account): void { if (!['drives', 'drivemesh'].includes(account.username) && this.isSmbdRunning()) run('smbcontrol', ['-s', sambaConfig, 'all', 'close-share', account.username]); }
  disableUser(account: Account): void { try { run('smbpasswd', ['-c', sambaConfig, '-s', '-x', account.system_username]); } catch { console.warn('Unable to remove SMB account', account.id); } }
  writeConfig(accounts: Account[]): void {
    fs.mkdirSync('/run/drivemesh', { recursive: true, mode: 0o700 });
    for (const a of accounts) if (['global','homes','printers','netlogon','sysvol','root','nobody','con','prn','aux','nul'].includes(a.username) || a.username.startsWith('dm') || !/^[a-z][a-z0-9_]{2,19}$/.test(a.username) || !/^dm[a-f0-9]{20}$/.test(a.system_username) || !/^[a-f0-9-]{36}$/.test(a.id)) throw new Error('Invalid account identity');
    const active = accounts.filter(a => a.smb_enabled);
    fs.writeFileSync(usernameMap, active.map(a => `${a.system_username} = ${a.username}`).join('\n') + '\n', { mode: 0o600 });
    const shares = active.filter(a => a.username !== 'drives' && a.username !== 'drivemesh').map(a => `[${a.username}]\n path = ${mountService.accountPath(a)}\n valid users = ${a.system_username}\n force user = ${a.system_username}\n guest ok = no\n read only = no\n browseable = no\n follow symlinks = no\n wide links = no\n smb encrypt = required\n`).join('\n');
    const shared = (name: string, browseable: string) => `[${name}]\n path = ${config.mountPoint}/%u\n valid users = @drivemesh\n guest ok = no\n read only = no\n browseable = ${browseable}\n follow symlinks = no\n wide links = no\n smb encrypt = required\n`;
    const content = `[global]\n server role = standalone server\n security = user\n ntlm auth = ntlmv2-only\n lanman auth = no\n map to guest = never\n username map = ${usernameMap}\n server min protocol = SMB3_00\n smb encrypt = required\n disable netbios = yes\n load printers = no\n printing = bsd\n printcap name = /dev/null\n log file = /var/log/samba/log.%m\n${shared('DriveMesh', 'yes')}${shared('drives', 'no')}${shares}`;
    const temp = `${sambaConfig}.new`;
    fs.writeFileSync(temp, content, { mode: 0o600 });
    run('testparm', ['-s', temp]);
    fs.renameSync(temp, sambaConfig);
    if (this.isSmbdRunning()) run('smbcontrol', ['-s', sambaConfig, 'all', 'reload-config']);
  }
  start(): void {
    run('pdbedit', ['-s', sambaConfig, '-P', 'bad lockout attempt', '-C', '5']);
    run('pdbedit', ['-s', sambaConfig, '-P', 'reset count minutes', '-C', '15']);
    run('pdbedit', ['-s', sambaConfig, '-P', 'lockout duration', '-C', '15']);
    run('smbd', ['-s', sambaConfig, '-D']);
  }
  isSmbdRunning(): boolean { try { run('smbcontrol', ['-s', sambaConfig, 'smbd', 'ping']); return true; } catch { return false; } }
}
export const sambaService = new SambaService();
