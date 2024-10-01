// routes/videoRoutes.ts
import { Router } from 'express';
import { uploadFiles, uploadFiless, uploadMiddleware } from '../controllers/videos';

const router = Router();

// Define the route for file uploads
router.post('/upload', uploadMiddleware, uploadFiles);
router.post('/uploads', uploadMiddleware, uploadFiless);
export default router;
