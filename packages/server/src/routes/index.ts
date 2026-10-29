import { Router } from 'express';
import authRoutes from './auth.routes';
import credentialsRoutes from './credentials.routes';
import statusRoutes from './status.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/credentials', credentialsRoutes);
router.use('/status', statusRoutes);

export default router;
