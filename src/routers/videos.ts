// routes/videoRoutes.ts
import { Router } from 'express';
import { uploadFiles, uploadMiddleware } from '../controllers/videos';

const router = Router();

// Define the route for file uploads
router.post('/upload', uploadMiddleware, uploadFiles);

export default router;
