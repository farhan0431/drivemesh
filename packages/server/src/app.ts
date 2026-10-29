import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

export function createApp(): express.Application {
  const app = express();

  // Basic Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Main API Router
  app.use('/api', routes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
