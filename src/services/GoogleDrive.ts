import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';
import fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import * as path from 'path';
import { PassThrough } from 'stream';
//const gapi = window.gapi;
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
const credentialsPath = path.join(__dirname, '../../client_secret_1039648523863-05fo07bbgij6rrurc9st45l92seh3b5k.apps.googleusercontent.com.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
const drive = google.drive({ version: 'v3', auth: oAuth2Client });
const authorizationCode = '4%2F0AQlEd8xZU29R18OCJh_RbXprwzw97_yoGZLELV8BmIfFQVZTIAL_13qxDVaq0IhEh8qdjA';



// دالة لحفظ tokens في ملف JSON
async function saveTokens(tokens: any) {
    const { access_token, refresh_token, expiry_date, token_type } = tokens;

    // Check if expiry_date exists and is valid
    let expiryDate = new Date();
    if (expiry_date && !isNaN(new Date(expiry_date).getTime())) {
        expiryDate = new Date(expiry_date);
    } else {
        console.error("Invalid expiry_date provided.");
    }

    try {
        const existingToken = await prisma.token.findFirst();
        if (existingToken) {
            await prisma.token.update({
                where: { id: existingToken.id },
                data: {
                    accessToken: access_token,
                    refreshToken: refresh_token || existingToken.refreshToken,
                    expiryDate,
                    tokenType: token_type || existingToken.tokenType,
                },
            });
        } else {
            await prisma.token.create({
                data: {
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiryDate, // Ensure expiryDate is valid
                    tokenType: token_type || "Bearer", // Default to Bearer if undefined
                },
            });
        }
        console.log("Tokens saved/updated successfully.");
    } catch (error) {
        console.error("Error saving tokens to database:", error);
    }
}


// دالة لحفظ tokens في ملف JSON

// دالة لتحميل tokens من ملف JSON
async function loadTokens() {
    try {
        const tokenData = await prisma.token.findFirst();
        if (tokenData) {
            oAuth2Client.setCredentials({
                access_token: tokenData.accessToken,
                refresh_token: tokenData.refreshToken,
                expiry_date: tokenData.expiryDate.getTime(),
                token_type: tokenData.tokenType,
            });
        } else {
            console.log('No tokens found in the database, please authorize the app.');
        }
    } catch (error) {
        console.error('Error loading tokens from database:', error);
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
oAuth2Client.on('tokens', async (tokens) => {
    await saveTokens(tokens);
    console.log('New tokens have been saved to the database.');
});

// تحميل tokens عند بدء التشغيل
// تحديث Access Token تلقائيًا باستخدام Refresh Token
async function refreshAccessTokenIfNeeded() {
    try {
        const { access_token, refresh_token, expiry_date } = oAuth2Client.credentials;

        if (!access_token && refresh_token) {
            console.log('Access Token missing, attempting to refresh using refresh token.');
            const { credentials } = await oAuth2Client.refreshAccessToken(); // Refresh token
            oAuth2Client.setCredentials(credentials); // Save new tokens
            await saveTokens(credentials); // Save new tokens to the database
            console.log('Access Token has been refreshed and saved.');
        } else if (expiry_date && expiry_date < Date.now()) {
            console.log('Access Token is expired, refreshing...');
            const { credentials } = await oAuth2Client.refreshAccessToken(); // Refresh token
            oAuth2Client.setCredentials(credentials); // Save new tokens
            await saveTokens(credentials); // Save new tokens to the database
            console.log('Access Token has been refreshed.');
        } else {
            console.log('Access Token is valid.');
        }
    } catch (error) {
        console.error('Error refreshing access token:', error instanceof Error ? error.message : error);
    }
}

// تحميل التوكنات وتجديدها إذا لزم الأمر
/*
saveTokens({
    access_token: 'ya29.a0AcM612xGf7WERcvBNqcPrLWMdxbWPeZ5iRg1laeqlMLfRVorTFviVPbL9OnWg_gc0gvpRyL5UhzYCn86lvchVsGg3ZBSt__DN0MrL74ta3UCIG-Ygf3g4HvtGjqCQOhi6JNH8WGvhHEzZPnOb5gG53B85GuE26eofoWzPNjCUQaCgYKAcQSARESFQHGX2MibcgdD5NjIg4n1FFuJAW6LA0177',
    refresh_token: '1//03vLyRYBM9d1dCgYIARAAGAMSNwF-L9IrXfxPBeheOJMdrdAJPzrq9zhCRZqYhzRbI922A5ZNGkg_-ZaMTFCY9L1IuGc6rjvhYP0',
});*/
refreshAccessTokenIfNeeded();
loadTokens();


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
        return Promise.all(fileBuffers.map(async (fileBuffer, index) => {
            const passThrough = new PassThrough();
            passThrough.end(fileBuffer);

            const response = await drive.files.create({
                requestBody: { name: fileNames[index], mimeType },
                media: { mimeType, body: passThrough },
            });

            const fileId = response.data.id;
            return `https://drive.google.com/uc?id=${fileId}`;
        }));
    }

    async uploadVideosInBackground(lectureId: number, videoBuffers: Buffer[], videoNames: string[], imageBuffer: Buffer) {
        const videoUrls = await this.uploadFilesToDrive(videoBuffers, videoNames, 'video/mp4');
        const imageUrl = (await this.uploadFilesToDrive([imageBuffer], ['thumbnail'], 'image/jpeg'))[0];

        await prisma.lecture.update({
            where: { id: lectureId },
            data: {
                video: { create: videoUrls.map((url, index) => ({ url, name: videoNames[index] })) },
                photoUrl: imageUrl,
            }
        });
    } // رمز التفويض الذي حصلت عليه

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
export default videoService;