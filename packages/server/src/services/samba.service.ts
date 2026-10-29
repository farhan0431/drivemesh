import { execSync } from 'child_process';
import fs from 'fs';
import { config } from '../config';

export class SambaService {
  ensureSambaConfig(): void {
    const smbConfPath = '/etc/samba/smb.conf';
    if (!fs.existsSync(smbConfPath)) {
      console.warn('Warning: /etc/samba/smb.conf not found');
      return;
    }

    const confContent = fs.readFileSync(smbConfPath, 'utf8');
    const shareHeader = `[${config.sambaShareName}]`;

    if (!confContent.includes(shareHeader)) {
      const shareBlock = `
# --- DRIVEMESH GOOGLE DRIVE GATEWAY ---
[${config.sambaShareName}]
   comment = DriveMesh Streaming Gateway
   path = ${config.mountPoint}
   browseable = yes
   read only = no
   guest ok = no
   create mask = 0755
   directory mask = 0755
   server min protocol = SMB3_00
   smb encrypt = desired
# --- END DRIVEMESH ---
`;
      try {
        fs.appendFileSync(smbConfPath, shareBlock, 'utf8');
        execSync('sudo systemctl restart smbd', { stdio: 'ignore' });
        console.log(`Configured Samba share [${config.sambaShareName}]`);
      } catch (err) {
        console.error('Failed to append to smb.conf:', err);
      }
    }
  }

  setSambaUser(username: string, password?: string): boolean {
    try {
      try {
        execSync(`id -u "${username}"`, { stdio: 'ignore' });
      } catch {
        execSync(`sudo useradd -M -s /usr/sbin/nologin "${username}"`, { stdio: 'ignore' });
        console.log(`Created system user: ${username}`);
      }

      if (password) {
        execSync(`printf "%s\\n%s\\n" "${password}" "${password}" | sudo smbpasswd -s -a "${username}"`, {
          stdio: 'ignore',
        });
        console.log(`Updated Samba password for user: ${username}`);
      }

      execSync('sudo systemctl reload-or-restart smbd', { stdio: 'ignore' });
      return true;
    } catch (err) {
      console.error('Error configuring Samba user:', err);
      return false;
    }
  }

  isSmbdRunning(): boolean {
    try {
      execSync('systemctl is-active --quiet smbd');
      return true;
    } catch {
      return false;
    }
  }
}

export const sambaService = new SambaService();
