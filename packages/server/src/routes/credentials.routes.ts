import { Router } from 'express';
import { CredentialsController } from '../controllers/credentials.controller';

const router = Router();

router.get('/', CredentialsController.getCredentials);
router.post('/', CredentialsController.setCredentials);

export default router;
