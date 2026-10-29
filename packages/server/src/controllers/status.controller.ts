import { Request, Response } from 'express';
import { sambaService } from '../services/samba.service';
import { mountService } from '../services/mount.service';
import { config } from '../config';

export class StatusController {
  static getStatus(req: Request, res: Response): void {
    const smbRunning = sambaService.isSmbdRunning();
    const isMounted = mountService.isMounted();

    res.json({
      success: true,
      data: {
        smbService: smbRunning,
        webdavService: true,
        mountActive: isMounted,
        sslActive: true,
        domain: config.domain,
      },
    });
  }

  static getHealth(req: Request, res: Response): void {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'DriveMesh Gateway Engine',
      version: '1.0.0',
    });
  }
}
