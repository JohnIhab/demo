import { PrismaClient } from '@prisma/client';
import cloudinary from '../utils/configCloudinary';

const prisma = new PrismaClient();

class VideoService {
    async saveLectureDetails(name: string,
        numberOfLectures: number,
        price: string, contentId: string
        , isFree: boolean
        , subTitle:string) {
        try {
            const newLecture = await prisma.lecture.create({
                data: {
                    name,
                    numberOfLectures,
                    price: price.toString(),
                    contentId: parseInt(contentId, 10),
                    isFree,
                    subTitle
                }
            });
            return newLecture;
        } catch (error) {
            console.error('Save Error:', error);
            throw new Error('Failed to save lecture details.');
        }
    }
    async uploadVideosInBackground(lectureId: number, videoBuffers: Buffer[], videoNames: string[], imageBuffer: Buffer) {
        try {
            // Upload videos
            const videoUrls = await Promise.all(videoBuffers.map(async (videoBuffer, index) => {
                try {
                    const videoUpload = await new Promise<any>((resolve, reject) => {
                        const stream = cloudinary.v2.uploader.upload_stream(
                            { 
                                resource_type: 'video', 
                                folder: 'videos',
                                timeout: 300000 // Set timeout to 5 minutes
                            },
                            (error, result) => {
                                if (error) {
                                    console.error('Video Upload Error:', error);
                                    return reject(error);
                                }
                                if (!result || !result.secure_url) {
                                    return reject(new Error('Video upload result is undefined or missing secure_url.'));
                                }
                                console.log('Video Uploaded:', result.secure_url);
                                resolve(result.secure_url);
                            }
                        );
                        stream.end(videoBuffer);
                    });
                    
                    const videoNameWithExtension = videoNames[index];
                    const videoNameWithoutExtension = videoNameWithExtension.split('.').slice(0, -1).join('.');
    
                    return {
                        url: videoUpload,
                        name: videoNameWithoutExtension, // Save the video name without the extension
                    };
                } catch (error) {
                    console.error('Video Upload Failed:', error);
                    throw error; // Rethrow to ensure the error is caught in the outer catch
                }
            }));
    
            // Upload image
            const imageUpload = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.v2.uploader.upload_stream(
                    { 
                        resource_type: 'image', 
                        folder: 'thumbnails',
                        timeout: 300000 // Set timeout to 5 minutes
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Image Upload Error:', error);
                            return reject(error);
                        }
                        if (!result || !result.secure_url) {
                            return reject(new Error('Image upload result is undefined or missing secure_url.'));
                        }
                        console.log('Image Uploaded:', result.secure_url);
                        resolve(result.secure_url);
                    }
                );
                stream.end(imageBuffer);
            });
    
            // Update database with video URLs, video names, and image URL
            await prisma.lecture.update({
                where: { id: lectureId },
                data: {
                    video: { 
                        create: videoUrls.map(({ url, name }) => ({
                            url,
                            name, // Save the video name in the Video model
                        })),
                    },
                    photoUrl: imageUpload,
                },
            });
            console.log(`Upload complete for lecture ID ${lectureId}`);
        } catch (error) {
            console.error('Background Upload Error:', error);
            throw new Error('Failed to upload videos and image in background.');
        }
    }
    

    async getAllVideos() {
        try {
            const videos = await prisma.video.findMany();
            return videos;
        } catch (error) {
            console.error('Fetch Error:', error);
            throw new Error('Failed to fetch videos.');
        }
    }
    async getAlllecture() {
        try {
            const lecture = await prisma.lecture.findMany({
                include: {
                    video : true, // Include the related videos for each lecture
                },
            });
            return lecture;
        } catch (error) {
            console.error('Fetch Error:', error);
            throw new Error('Failed to fetch videos.');
        }
    }
    async getAllLecturesBycontentId(contentId: number) {
        try {
            const content = await prisma.courseContent.findUnique({
                where: { id: contentId },
                select: { content: true } // Fetch only the content name
            });
    
            if (!content) {
                throw new Error('Content not found content .');
            }
            const lectures = await prisma.lecture.findMany({
                where: {
                    contentId: contentId,  // Filter by the provided courseId
                },
                include: {
                    video: true,  // Include the related videos for each lecture
                },
            });
            return lectures;
        } catch (error) {
            console.error('Fetch Error:', error);
            throw new Error('Failed to fetch lectures for the specified course.');
        }
    }
    async  deleteLecture(lectureId: number) {
            // Delete related videos
            await prisma.video.deleteMany({
                where: {
                    lectureId: lectureId
                }
            });
    
            // Delete the lecture
            await prisma.lecture.delete({
                where: {
                    id: lectureId
                }
            });
        }





}

const videoService = new VideoService();
export default videoService;
