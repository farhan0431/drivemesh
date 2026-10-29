import { Request, Response, NextFunction } from 'express';
import { CredentialModel } from '../models/credential.model';
import { hashSecret } from '../utils/vault.util';
import { sambaService } from '../services/samba.service';
import { config } from '../config';

export class CredentialsController {
  static async getCredentials(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const creds = await CredentialModel.get();
      const username = creds ? creds.username : 'drivemesh';

      res.json({
        success: true,
        data: {
          username,
          hasPassword: !!creds,
          serverDomain: config.domain,
          serverHost: config.domain,
          serverIp: '103.49.239.82',
          smbUrl: `smb://${config.domain}/${config.sambaShareName}`,
          windowsPath: `\\\\${config.domain}\\${config.sambaShareName}`,
          webdavUrl: `${config.protocol}://${config.domain}/webdav`,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async setCredentials(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { username, password } = req.body;

    if (!username || typeof username !== 'string') {
      res.status(400).json({ success: false, error: 'Username wajib diisi' });
      return;
    }

    if (!/^[a-zA-Z0-9_-]{3,32}$/.test(username)) {
      res.status(400).json({
        success: false,
        error: 'Username hanya boleh 3-32 karakter alfanumerik (huruf, angka, tanda minus, underscore)',
      });
      return;
    }

    try {
      const existing = await CredentialModel.get();
      let passwordHash = existing ? existing.password_hash : '';

      if (password) {
        if (password.length < 6) {
          res.status(400).json({ success: false, error: 'Password minimal 6 karakter' });
          return;
        }
        passwordHash = hashSecret(password);
        sambaService.setSambaUser(username, password);
      } else if (existing && existing.username !== username) {
        sambaService.setSambaUser(username);
      }

      await CredentialModel.upsert(username, passwordHash);

      res.json({
        success: true,
        message: 'Kredensial jaringan berhasil disimpan',
        data: {
          username,
          hasPassword: true,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
