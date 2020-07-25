import express from 'express';

import authenticationRoutes from './authentication';

const router = express.Router();

router.use('/api/authentication', authenticationRoutes);

export default router;
