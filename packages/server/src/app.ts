import express from 'express';
import cors from 'cors';
import routes from './routes';
import { config } from './config';
import { errorHandler } from './middlewares/errorHandler.middleware';

export function createApp(): express.Application {
  const app = express();
  // Enable only behind a trusted proxy that appends the actual client address.
  if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);

  // Basic Middlewares
  app.use(cors({ origin: false }));
  app.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const origin = req.get('origin');
      const expected = `${config.protocol}://${config.domain}`;
      if (!origin || origin !== expected) { res.status(403).json({ success: false, error: 'Origin tidak diizinkan' }); return; }
    }
    next();
  });
  app.disable('x-powered-by');
  app.use((req, res, next) => { res.set({ 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Cache-Control': 'no-store' }); next(); });
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: true }));

  // Main API Router
  app.use('/api', routes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
