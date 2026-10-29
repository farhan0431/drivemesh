import { Request, Response, NextFunction } from 'express';
import { AccountModel } from '../models/account.model';
import { config } from '../config';
export class CredentialsController {
  static async getCredentials(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const account = await AccountModel.byId(res.locals.userId);
      if (!account) { res.status(401).json({ success: false }); return; }
      res.json({ success: true, data: { username: account.username, hasPassword: account.smb_enabled,
        smbUrl: `smb://${config.smbHost}`, windowsPath: `\\\\${config.smbHost}`, directWindowsPath: `\\\\${config.smbHost}\\DriveMesh` } });
    } catch (error) { next(error); }
  }
}
