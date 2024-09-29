"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const configCloudinary_1 = __importDefault(require("../utils/configCloudinary"));
const prisma = new client_1.PrismaClient();
class Lecture {
    async getAllLecture() {
        const lectures = await prisma.lecture.findMany({
            include: {
                video: true,
                //   terms: true, // Assuming this is the relationship name
                // courseContent: true,
            },
        });
        return lectures;
    }
    ;
    async getLectureById(id) {
        const LectureId = parseInt(id);
        const lecture = await prisma.lecture.findUnique({
            where: { id: LectureId },
        });
        return lecture;
    }
    ;
    /*
    
    async  createLecture (id: string ,data : createLectureType){
        const { name, numberOfLectures, price, photoUrl } = data;
        
            const newLecture = await prisma.lecture.create({
            data: {
                name,
                numberOfLectures,
                price,
                photoUrl,
                contentId,
            },
            });
            return newLecture;
    };
    */
    /*
    //async uploadVideosAndImageInBackground(
        lectureId: number,
        videoFiles: Express.Multer.File[],
        imageFile: Express.Multer.File
    ) {
        try {
            // Log details of imageFile for debugging
            console.log('Image File Details:', {
                bufferType: typeof imageFile.buffer,
                bufferLength: imageFile.buffer.length,
                imageFile
            });
    
            // Verify imageFile is provided and is of type Buffer
            if (!imageFile || !Buffer.isBuffer(imageFile.buffer)) {
                throw new Error('Invalid image file or image buffer');
            }
    
            console.log('Starting image upload...');
            const imageUpload = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.v2.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: 'lectures/thumbnails',
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Error uploading image:', error);
                            return reject(error);
                        }
                        if (!result) {
                            console.error('Image upload result is undefined');
                            return reject(new Error('Image upload result is undefined'));
                        }
                        console.log('Image upload successful:', result.secure_url);
                        resolve(result);
                    }
                );
                stream.end(imageFile.buffer);
            });
    
            // Upload videos
            const uploadPromises = videoFiles.map((videoFile, index) => {
                console.log(`Starting upload for video ${index + 1}...`);
                // Verify videoFile is provided and is of type Buffer
                if (!videoFile || !Buffer.isBuffer(videoFile.buffer)) {
                    throw new Error(`Invalid video file ${index + 1} or video buffer`);
                }
    
                return new Promise<void>((resolve, reject) => {
                    const stream = cloudinary.v2.uploader.upload_stream(
                        {
                            resource_type: 'video',
                            folder: 'lectures/videos',
                            chunk_size: 6000000, // 6 MB chunks
                        },
                        async (error, result) => {
                            if (error) {
                                console.error(`Error uploading video ${index + 1}:`, error);
                                return reject(error);
                            }
                            if (!result) {
                                console.error(`Video ${index + 1} upload result is undefined`);
                                return reject(new Error('Video upload result is undefined'));
                            }
                            console.log(`Video ${index + 1} upload successful:`, result.secure_url);
                            try {
                                await prisma.videoss.create({
                                    data: {
                                        url: result.secure_url,
                                        lectureId: lectureId,
                                    },
                                });
                                resolve();
                            } catch (error) {
                                console.error(`Error saving video ${index + 1} URL to database:`, error);
                                reject(error);
                            }
                        }
                    );
                    stream.end(videoFile.buffer);
                });
            });
    
            await Promise.all(uploadPromises);
    
            if (!imageUpload) {
                throw new Error('Image upload result is undefined');
            }
    
            await prisma.lecture.update({
                where: { id: lectureId },
                data: { photoUrl: imageUpload.secure_url },
            });
    
            console.log(`All videos and lecture image uploaded successfully for lecture ID ${lectureId}`);
        } catch (error) {
            console.error('Failed to upload videos and image in background:', error);
            throw new Error('Failed to upload all videos and image.');
        } finally {
            await prisma.$disconnect();
        }
    }
    
    */
    /*
    async uploadVideosAndImageInBackground(lectureId: number, videoFiles: Express.Multer.File[], imageFile: Express.Multer.File) {
        try {
            // Upload image
            console.log('Starting image upload...');
            const imageUpload = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.v2.uploader.upload_stream(
                    { resource_type: 'image', folder: 'lectures/thumbnails' },
                    (error, result) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error('Image upload result is undefined'));
                        resolve(result);
                    }
                );
                stream.end(imageFile.buffer);
            });
    
            // Upload videos
            const uploadPromises = videoFiles.map((videoFile) => {
                return new Promise<void>((resolve, reject) => {
                    console.log(`Starting upload for video + 1...`);
                    const stream = cloudinary.v2.uploader.upload_stream(
                        { resource_type: 'video', folder: 'lectures/videos'},
                        async (error, result) => {
                            if (error) return reject(error);
                            if (!result) return reject(new Error('Video upload result is undefined'));
                            try {
                                await prisma.videoss.create({
                                    data: {
                                        url: result.secure_url,
                                        lectureId: lectureId,
                                    },
                                });
                                resolve();
                            } catch (error) {
                                reject(error);
                            }
                        }
                    );
                    stream.end(videoFile.buffer);
                });
            });
    
            await Promise.all(uploadPromises);
    
            if (!imageUpload) {
                throw new Error('Image upload result is undefined');
            }
    
            await prisma.lecture.update({
                where: { id: lectureId },
                data: { photoUrl: imageUpload.secure_url },
            });
    
            console.log(`All videos and lecture image uploaded successfully for lecture ID ${lectureId}`);
        } catch (error) {
            console.error('Failed to upload videos and image in background:', error);
            throw new Error('Failed to upload all videos and image.');
        } finally {
            await prisma.$disconnect();
        }
    }
    */
    /*
    async uploadVideosAndImageInBackground(
        lectureId: number,
        videoFiles: Express.Multer.File[],
        imageFile: Express.Multer.File
    ) {
        try {
            // Upload image
            console.log('Starting image upload...');
            const imageUpload = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.v2.uploader.upload_stream(
                    { resource_type: 'image', folder: 'lectures/thumbnails' },
                    (error, result) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error('Image upload result is undefined'));
                        console.log('Image upload successful:', result.secure_url);
                        resolve(result);
                    }
                );
                stream.end(imageFile.buffer);
            });
            console.log('Type of imageFile.buffer:', Buffer.isBuffer(imageFile.buffer));
    
            
            // Upload videos
            const uploadPromises = videoFiles.map((videoFile, index) => {
                console.log(`Starting upload for video ${index + 1}...`); // Updated log to include index
                return new Promise<void>((resolve, reject) => {
                    const stream = cloudinary.v2.uploader.upload_stream(
                        { resource_type: 'video', folder: 'lectures/videos' },
                        async (error, result) => {
                            if (error) return reject(error);
                            if (!result) return reject(new Error('Video upload result is undefined'));
                            console.log(`Video ${index + 1} upload successful:`, result.secure_url);
                            try {
                                await prisma.videoss.create({
                                    data: {
                                        url: result.secure_url,
                                        lectureId: lectureId,
                                    },
                                });
                                resolve();
                            } catch (error) {
                                reject(error);
                            }
                        }
                    );
                    stream.end(videoFile.buffer);
                    console.log('Type of videoFile.buffer:', Buffer.isBuffer(videoFile.buffer));
                });
                
            });
    
            await Promise.all(uploadPromises);
    
            if (!imageUpload) {
                throw new Error('Image upload result is undefined');
            }
    
            await prisma.lecture.update({
                where: { id: lectureId },
                data: { photoUrl: imageUpload.secure_url },
            });
    
            console.log(`All videos and lecture image uploaded successfully for lecture ID ${lectureId}`);
        } catch (error) {
            console.error('Failed to upload videos and image in background:', error);
            throw new Error('Failed to upload all videos and image.');
        } finally {
            await prisma.$disconnect();
        }
    }
    */
    /*
    async uploadVideosAndImageInBackground(
        lectureId: number,
        videoFiles: Express.Multer.File[],
        imageFile: Express.Multer.File
    ) {
        try {
            // Upload image
            console.log('Starting image upload...');
            if (!Buffer.isBuffer(imageFile.buffer)) {
                throw new Error('Image file buffer is not a Buffer object');
            }
            const imageUpload = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.v2.uploader.upload_stream(
                    { resource_type: 'image', folder: 'lectures/thumbnails' },
                    (error, result) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error('Image upload result is undefined'));
                        console.log('Image upload successful:', result.secure_url);
                        resolve(result);
                    }
                );
                stream.end(imageFile.buffer);
            });
    
            // Upload videos
            const uploadPromises = videoFiles.map((videoFile, index) => {
                console.log(`Starting upload for video ${index + 1}...`);
                if (!Buffer.isBuffer(videoFile.buffer)) {
                    throw new Error(`Video file buffer ${index + 1} is not a Buffer object`);
                }
                return new Promise<void>((resolve, reject) => {
                    const stream = cloudinary.v2.uploader.upload_stream(
                        { resource_type: 'video', folder: 'lectures/videos' },
                        async (error, result) => {
                            if (error) return reject(error);
                            if (!result) return reject(new Error('Video upload result is undefined'));
                            console.log(`Video ${index + 1} upload successful:`, result.secure_url);
                            try {
                                await prisma.videoss.create({
                                    data: {
                                        url: result.secure_url,
                                        lectureId: lectureId,
                                    },
                                });
                                resolve();
                            } catch (error) {
                                reject(error);
                            }
                        }
                    );
                    stream.end(videoFile.buffer);
                });
            });
    
            await Promise.all(uploadPromises);
    
            if (!imageUpload) {
                throw new Error('Image upload result is undefined');
            }
    
            await prisma.lecture.update({
                where: { id: lectureId },
                data: { photoUrl: imageUpload.secure_url },
            });
    
            console.log(`All videos and lecture image uploaded successfully for lecture ID ${lectureId}`);
        } catch (error) {
            console.error('Failed to upload videos and image in background:', error);
            throw new Error('Failed to upload all videos and image.');
        } finally {
            await prisma.$disconnect();
        }
    }
    */
    async uploadVideosAndImageInBackground(lectureId, videoFiles, imageFile) {
        try {
            // Check and log buffer types
            console.log('Type of imageFile.buffer:', Buffer.isBuffer(imageFile.buffer));
            // Upload image
            console.log('Starting image upload...');
            if (!Buffer.isBuffer(imageFile.buffer)) {
                throw new Error('Image file buffer is not a Buffer object');
            }
            const imageUpload = await new Promise((resolve, reject) => {
                const stream = configCloudinary_1.default.v2.uploader.upload_stream({ resource_type: 'image', folder: 'lectures/thumbnails' }, (error, result) => {
                    if (error)
                        return reject(error);
                    if (!result)
                        return reject(new Error('Image upload result is undefined'));
                    console.log('Image upload successful:', result.secure_url);
                    resolve(result);
                });
                stream.end(imageFile.buffer);
            });
            // Upload videos
            const uploadPromises = videoFiles.map((videoFile, index) => {
                console.log(`Starting upload for video ${index + 1}...`);
                if (!Buffer.isBuffer(videoFile.buffer)) {
                    throw new Error(`Video file buffer ${index + 1} is not a Buffer object`);
                }
                return new Promise((resolve, reject) => {
                    const stream = configCloudinary_1.default.v2.uploader.upload_stream({ resource_type: 'video', folder: 'lectures/videos' }, async (error, result) => {
                        if (error)
                            return reject(error);
                        if (!result)
                            return reject(new Error('Video upload result is undefined'));
                        console.log(`Video ${index + 1} upload successful:`, result.secure_url);
                        try {
                            await prisma.video.create({
                                data: {
                                    url: result.secure_url,
                                    lectureId: lectureId,
                                },
                            });
                            resolve();
                        }
                        catch (error) {
                            reject(error);
                        }
                    });
                    stream.end(videoFile.buffer);
                });
            });
            await Promise.all(uploadPromises);
            if (!imageUpload) {
                throw new Error('Image upload result is undefined');
            }
            await prisma.lecture.update({
                where: { id: lectureId },
                data: { photoUrl: imageUpload.secure_url },
            });
            console.log(`All videos and lecture image uploaded successfully for lecture ID ${lectureId}`);
        }
        catch (error) {
            console.error('Failed to upload videos and image in background:', error);
            throw new Error('Failed to upload all videos and image.');
        }
        finally {
            await prisma.$disconnect();
        }
    }
    /*
    
    async  updateLecture  (id: string , data : updateLectureType)  {
        const { name, numberOfLectures, price, photoUrl, contentId } = data;
            const updatedLecture = await prisma.lecture.update({
            where: { id: Number(id) },
            data: {
                name,
                numberOfLectures,
                price,
                photoUrl,
                contentId,
            },
            });
            return updatedLecture;
    }
    */
    async deleteLecture(id) {
        const termId = parseInt(id);
        const deletedLecture = await prisma.lecture.delete({
            where: { id: termId },
        });
    }
    ;
}
const LectureService = new Lecture();
exports.default = LectureService;
///6379
//# sourceMappingURL=lectureService.js.map