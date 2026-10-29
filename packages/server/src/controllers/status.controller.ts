import { Request, Response } from 'express';
import { sambaService } from '../services/samba.service';
import { config } from '../config';
export class StatusController {
  static getStatus(req: Request, res: Response): void {
    res.json({ success: true, data: { smbService: sambaService.isSmbdRunning(), domain: config.domain } });
  }
  static getHealth(req: Request, res: Response): void { res.json({ status: 'healthy', service: 'DriveMesh' }); }
}
