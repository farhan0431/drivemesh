import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.get('/google/url', AuthController.getAuthUrl);
router.get('/google/callback', AuthController.handleCallback);
router.get('/status', AuthController.getStatus);
router.post('/disconnect', AuthController.disconnect);

export default router;
