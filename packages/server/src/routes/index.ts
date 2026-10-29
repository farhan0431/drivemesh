import { Router } from 'express';
import { requireSession } from '../middlewares/session.middleware';
import authRoutes from './auth.routes';
import credentialsRoutes from './credentials.routes';
import statusRoutes from './status.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/credentials', requireSession, credentialsRoutes);
router.use('/status', statusRoutes);

export default router;
