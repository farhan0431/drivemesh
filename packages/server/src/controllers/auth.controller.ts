import { Request, Response, NextFunction } from 'express';
import { gdriveService } from '../services/gdrive.service';
import { mountService } from '../services/mount.service';
import { config } from '../config';

export class AuthController {
  static getAuthUrl(req: Request, res: Response): void {
    if (!config.googleClientId || !config.googleClientSecret) {
      res.status(400).json({
        success: false,
        error: 'GOOGLE_CLIENT_ID atau GOOGLE_CLIENT_SECRET belum dikonfigurasi di file .env',
      });
      return;
    }

    const url = gdriveService.generateAuthUrl();
    res.json({ success: true, url });
  }

  static async handleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    const code = req.query.code as string;
    if (!code) {
      res.redirect('/?error=No+code+provided');
      return;
    }

    try {
      await gdriveService.handleCallback(code);
      mountService.mountDrive().catch((err) => {
        console.error('Background mount error after callback:', err);
      });
      res.redirect('/?status=google_connected');
    } catch (err: unknown) {
      console.error('Callback handling error:', err);
      const message = err instanceof Error ? encodeURIComponent(err.message) : 'Auth+Failed';
      res.redirect(`/?error=${message}`);
    }
  }

  static async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = await gdriveService.getStatus();
      const isMounted = mountService.isMounted();

      res.json({
        success: true,
        data: {
          ...status,
          mountStatus: {
            active: isMounted,
            mountPoint: config.mountPoint,
            protocol: 'SMB 3.1.1 / WebDAV',
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async disconnect(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      mountService.unmount();
      await gdriveService.disconnect();
      res.json({ success: true, message: 'Google Drive berhasil diputuskan' });
    } catch (error) {
      next(error);
    }
  }
}
