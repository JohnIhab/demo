import { Router } from 'express';
import videoController from '../controllers/GoogleDrive';

const router = Router();
import multer from 'multer';
//import { uploadVideo } from '../controllers/test1';

const storage = multer.memoryStorage();
const upload = multer({ storage,limits: { fileSize: 2 * 1024 * 1024 * 1024 }, });
router.post('/Drive/:id',  upload.fields([{ name: 'videos', maxCount: 100 }, { name: 'image', maxCount: 1 }]), videoController.uploadVideos);
//router.get('/token',   videoController.getTokens);
//router.get('/hi',   videoController.hi);




// المسار لرفع الفيديو
//router.post('/upload-video', upload.single('video'), uploadVideo);
export default router;
