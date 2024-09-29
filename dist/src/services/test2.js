"use strict";
/*import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';
import fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import * as path from 'path';
const prisma = new PrismaClient();
import * as dotenv from 'dotenv';
dotenv.config();
// إعداد OAuth2Client باستخدام المتغيرات من ملف .env
/*
const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID1,
    process.env.GOOGLE_CLIENT_SECRET1,
    process.env.GOOGLE_REDIRECT_URI1
);
*/
// Configure Google Drive API
/*
const credentialsPath = path.join(__dirname, '../../client_secret_1039648523863-05fo07bbgij6rrurc9st45l92seh3b5k.apps.googleusercontent.com.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
const drive = google.drive({ version: 'v3', auth: oAuth2Client });
const authorizationCode = '4%2F0AQlEd8xZU29R18OCJh_RbXprwzw97_yoGZLELV8BmIfFQVZTIAL_13qxDVaq0IhEh8qdjA';

// مسار تخزين tokens
const tokenPath = path.join(__dirname, '../../tokens.json');

// دالة لحفظ tokens في ملف JSON
function saveTokens(tokens: any) {
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
}

// دالة لحفظ tokens في ملف JSON

// دالة لتحميل tokens من ملف JSON
function loadTokens() {
    if (fs.existsSync(tokenPath)) {
        const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
        oAuth2Client.setCredentials(tokens);
        console.log('Tokens loaded from file');
    } else {
        console.log('No tokens found, please authorize the app.');
    }
}

// استبدال Authorization Code بـ Access Token و Refresh Token
async function getAccessToken() {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/drive.file'],
    });

    console.log('Authorize this app by visiting this url:', authUrl);

    // بعد أن تحصل على الكود من URL، قم بتبديله بالرموز
    try {
        const { tokens } = await oAuth2Client.getToken(authorizationCode);
        oAuth2Client.setCredentials(tokens);
        saveTokens(tokens);
        console.log('Access Token and Refresh Token saved.');
    } catch (error) {
        console.error('Error retrieving access token:', error);
    }
}

// تحديث Access Token تلقائيًا باستخدام Refresh Token
oAuth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
        saveTokens(tokens);
    } else {
        saveTokens({
            access_token: tokens.access_token,
            refresh_token: fs.existsSync(tokenPath)
                ? JSON.parse(fs.readFileSync(tokenPath, 'utf8')).refresh_token
                : tokens.refresh_token
        });
    }
    console.log('New Access Token:', tokens.access_token);
});

// تحميل tokens عند بدء التشغيل
// تحديث Access Token تلقائيًا باستخدام Refresh Token
async function refreshAccessTokenIfNeeded() {
    try {
        if (!oAuth2Client.credentials.access_token) {
            throw new Error('Access Token is missing.');
        }

        // تحقق من صلاحية الـ access_token
        const expiryDate = oAuth2Client.credentials.expiry_date || 0;

        if (expiryDate < Date.now()) {
            console.log('Access Token is expired, refreshing...');
            const { credentials } = await oAuth2Client.refreshAccessToken(); // تجديد التوكن
            oAuth2Client.setCredentials(credentials); // حفظ التوكنات الجديدة
            saveTokens(credentials); // حفظ التوكنات بعد التجديد
            console.log('Access Token has been refreshed.');
        } else {
            console.log('Access Token is valid.');
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message.includes('invalid_token')) {
                console.log('Invalid token detected. Re-authenticating...');
                await getAccessToken(); // إعادة المصادقة إذا كان التوكن غير صالح
            } else {
                console.error('Error refreshing access token:', error.message);
            }
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
}

// تحميل التوكنات وتجديدها إذا لزم الأمر
loadTokens();
refreshAccessTokenIfNeeded();

class VideoService {
    async saveLectureDetails(name: string,
        numberOfLectures: number,
        price: string, contentId: string
        , isFree: boolean
        , subTitle: string) {
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

    async uploadFilesToDrive(fileBuffers: Buffer[], fileNames: string[], mimeType: string): Promise<string[]> {
        try {
            const fileUrls = await Promise.all(fileBuffers.map(async (fileBuffer, index) => {
                try {
                    const fileName = fileNames[index];
                    const tempFilePath = path.join(__dirname, `temp_${fileName}`);
                    fs.writeFileSync(tempFilePath, fileBuffer);
                    const fileStream = fs.createReadStream(tempFilePath);
    
                    const response = await drive.files.create({
                        requestBody: {
                            name: fileName,
                            mimeType: mimeType
                        },
                        media: {
                            mimeType: mimeType,
                            body: fileStream
                        }
                    });
    
                    fs.unlinkSync(tempFilePath); // حذف الملف المؤقت بعد رفعه
                    const fileId = response.data.id;
                    if (!fileId) {
                        throw new Error('File ID is undefined.');
                    }
                    return `https://drive.google.com/uc?id=${fileId}`;
                } catch (error) {
                    console.error('File Upload Failed:', error);
                    throw error;
                }
            }));
            return fileUrls;
        } catch (error) {
            console.error('Drive Upload Error:', error);
            throw new Error('Failed to upload files to Google Drive.');
        }
    }
    

    async uploadVideosInBackground(lectureId: number, videoBuffers: Buffer[], videoNames: string[], imageBuffer: Buffer) {
        try {
            const videoUrls = await this.uploadFilesToDrive(videoBuffers, videoNames, 'video/mp4');
            const imageUrl = (await this.uploadFilesToDrive([imageBuffer], ['thumbnail'], 'image/jpeg'))[0];

            await prisma.lecture.update({
                where: { id: lectureId },
                data: {
                    video: {
                        create: videoUrls.map((url, index) => ({
                            url,
                            name: videoNames[index].split('.').slice(0, -1).join('.')
                        }))
                    },
                    photoUrl: imageUrl
                }
            });
            console.log(`Upload complete for lecture ID ${lectureId}`);
        } catch (error) {
            console.error('Background Upload Error:', error);
            throw new Error('Failed to upload videos and image in background.');
        }
    }
    // رمز التفويض الذي حصلت عليه

async  getTokens() {
    try {
        // تبادل رمز التفويض للحصول على access_token و refresh_token
        const { tokens } = await oAuth2Client.getToken(authorizationCode);
        oAuth2Client.setCredentials(tokens);

        console.log('Access Token:', tokens.access_token);
        console.log('Refresh Token:', tokens.refresh_token);

        // يمكنك الآن تخزين الـ refresh_token واستخدامه في المستقبل
        fs.writeFileSync('tokens.json', JSON.stringify(tokens));
    } catch (error) {
        console.error('Error retrieving access token', error);
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
                    video: true,
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
                select: { content: true }
            });

            if (!content) {
                throw new Error('Content not found.');
            }
            const lectures = await prisma.lecture.findMany({
                where: {
                    contentId: contentId,
                },
                include: {
                    video: true,
                },
            });
            return lectures;
        } catch (error) {
            console.error('Fetch Error:', error);
            throw new Error('Failed to fetch lectures for the specified course.');
        }
    }

    async deleteLecture(lectureId: number) {
        await prisma.video.deleteMany({
            where: {
                lectureId: lectureId
            }
        });

        await prisma.lecture.delete({
            where: {
                id: lectureId
            }
        });
    }
}

const videoService = new VideoService();
export default videoService;*/ 
//# sourceMappingURL=test2.js.map