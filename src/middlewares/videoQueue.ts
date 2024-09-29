/*import { Queue, Worker } from 'bullmq';
import videoService from '../services/googleDriveService';
import * as dotenv from 'dotenv';

dotenv.config();

const videoQueue = new Queue('video-upload-queue', {
    connection: {
        host: process.env.REDIS_HOST,
        port: 6379,
        password: process.env.REDIS_PASSWORD,
        tls: {}, // قد تحتاج لإضافة هذا الحقل حسب البيئة التي تستخدمها.
    },
});

// دالة لإضافة مهمة رفع الفيديوهات إلى الطابور
export const addVideoUploadJob = (lectureId: number, videoBuffers: Buffer[], videoNames: string[], imageBuffer: Buffer) => {
    videoQueue.add('uploadVideos', {
        lectureId,
        videoBuffers,
        videoNames,
        imageBuffer,
    });
};

// إعداد العامل (worker) للتعامل مع مهام رفع الفيديوهات
const videoWorker = new Worker('video-upload-queue', async (job) => {
    const { lectureId, videoBuffers, videoNames, imageBuffer } = job.data;

    try {
        await videoService.uploadVideosInBackground(lectureId, videoBuffers, videoNames, imageBuffer);
        console.log(`Upload completed for lecture ID ${lectureId}`);
    } catch (error) {
        console.error('Error in worker job:', error);
        throw error;
    }
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: 6379,
        password: process.env.REDIS_PASSWORD,
        tls: {}, // قد تحتاج لإضافة هذا الحقل حسب البيئة التي تستخدمها.
    },
});
*/
/*import Queue from 'bull'; // استيراد مكتبة Bull
import videoService from '../services/googleDriveService';

// إنشاء قائمة المهام لتحميل الفيديوهات
const uploadQueue = new Queue('upload videos');

// عامل (Worker) لتحميل الفيديوهات
uploadQueue.process(async (job) => {
    const { lectureId, videoBuffers, videoNames, imageBuffer } = job.data;
    await videoService.uploadVideosInBackground(lectureId, videoBuffers, videoNames, imageBuffer);
});

// تصدير uploadQueue
export default uploadQueue;*/