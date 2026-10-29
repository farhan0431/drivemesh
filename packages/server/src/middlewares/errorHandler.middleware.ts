import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  console.error('Unhandled server error:', err);
  const message = 'Terjadi kesalahan pada server. Silakan coba lagi.';
  res.status(500).json({
    success: false,
    error: message,
  });
}
