"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const path = __importStar(require("path"));
const stream_1 = require("stream");
//const gapi = window.gapi;
const prisma = new client_1.PrismaClient();
const dotenv = __importStar(require("dotenv"));
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
const credentials = JSON.parse(fs_1.default.readFileSync(credentialsPath, 'utf8'));
const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
const drive = googleapis_1.google.drive({ version: 'v3', auth: oAuth2Client });
const authorizationCode = '4%2F0AQlEd8xZU29R18OCJh_RbXprwzw97_yoGZLELV8BmIfFQVZTIAL_13qxDVaq0IhEh8qdjA';
// مسار تخزين tokens
const tokenPath = path.join(__dirname, '../../tokens.json');
// دالة لحفظ tokens في ملف JSON
function saveTokens(tokens) {
    fs_1.default.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
}
// دالة لحفظ tokens في ملف JSON
// دالة لتحميل tokens من ملف JSON
function loadTokens() {
    if (fs_1.default.existsSync(tokenPath)) {
        const tokens = JSON.parse(fs_1.default.readFileSync(tokenPath, 'utf8'));
        oAuth2Client.setCredentials(tokens);
        console.log('Tokens loaded from file');
    }
    else {
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
    }
    catch (error) {
        console.error('Error retrieving access token:', error);
    }
}
// تحديث Access Token تلقائيًا باستخدام Refresh Token
oAuth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
        saveTokens(tokens);
    }
    else {
        saveTokens({
            access_token: tokens.access_token,
            refresh_token: fs_1.default.existsSync(tokenPath)
                ? JSON.parse(fs_1.default.readFileSync(tokenPath, 'utf8')).refresh_token
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
        }
        else {
            console.log('Access Token is valid.');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('invalid_token')) {
                console.log('Invalid token detected. Re-authenticating...');
                await getAccessToken(); // إعادة المصادقة إذا كان التوكن غير صالح
            }
            else {
                console.error('Error refreshing access token:', error.message);
            }
        }
        else {
            console.error('An unknown error occurred:', error);
        }
    }
}
// تحميل التوكنات وتجديدها إذا لزم الأمر
loadTokens();
refreshAccessTokenIfNeeded();
class VideoService {
    async saveLectureDetails(name, numberOfLectures, price, contentId, isFree, subTitle) {
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
        }
        catch (error) {
            console.error('Save Error:', error);
            throw new Error('Failed to save lecture details.');
        }
    }
    async uploadFilesToDrive(fileBuffers, fileNames, mimeType) {
        return Promise.all(fileBuffers.map(async (fileBuffer, index) => {
            const passThrough = new stream_1.PassThrough();
            passThrough.end(fileBuffer);
            const response = await drive.files.create({
                requestBody: { name: fileNames[index], mimeType },
                media: { mimeType, body: passThrough },
            });
            const fileId = response.data.id;
            return `https://drive.google.com/uc?id=${fileId}`;
        }));
    }
    async uploadVideosInBackground(lectureId, videoBuffers, videoNames, imageBuffer) {
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
    async getTokens() {
        try {
            // تبادل رمز التفويض للحصول على access_token و refresh_token
            const { tokens } = await oAuth2Client.getToken(authorizationCode);
            oAuth2Client.setCredentials(tokens);
            console.log('Access Token:', tokens.access_token);
            console.log('Refresh Token:', tokens.refresh_token);
            // يمكنك الآن تخزين الـ refresh_token واستخدامه في المستقبل
            fs_1.default.writeFileSync('tokens.json', JSON.stringify(tokens));
        }
        catch (error) {
            console.error('Error retrieving access token', error);
        }
    }
    async getAllVideos() {
        try {
            const videos = await prisma.video.findMany();
            return videos;
        }
        catch (error) {
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
        }
        catch (error) {
            console.error('Fetch Error:', error);
            throw new Error('Failed to fetch videos.');
        }
    }
    async getAllLecturesBycontentId(contentId) {
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
        }
        catch (error) {
            console.error('Fetch Error:', error);
            throw new Error('Failed to fetch lectures for the specified course.');
        }
    }
    async deleteLecture(lectureId) {
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
exports.default = videoService;
//# sourceMappingURL=googleDriveService.js.map