import { Router } from 'express';
import { StatusController } from '../controllers/status.controller';

const router = Router();

router.get('/', StatusController.getStatus);
router.get('/health', StatusController.getHealth);

export default router;
