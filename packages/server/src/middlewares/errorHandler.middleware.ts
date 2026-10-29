import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  console.error('Unhandled server error:', err);
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  res.status(500).json({
    success: false,
    error: message,
  });
}
