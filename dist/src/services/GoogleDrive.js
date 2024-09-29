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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
// دالة لحفظ tokens في ملف JSON
function saveTokens(tokens) {
    return __awaiter(this, void 0, void 0, function* () {
        const { access_token, refresh_token, expiry_date, token_type } = tokens;
        // Check if expiry_date exists and is valid
        let expiryDate = new Date();
        if (expiry_date && !isNaN(new Date(expiry_date).getTime())) {
            expiryDate = new Date(expiry_date);
        }
        else {
            console.error("Invalid expiry_date provided.");
        }
        try {
            const existingToken = yield prisma.token.findFirst();
            if (existingToken) {
                yield prisma.token.update({
                    where: { id: existingToken.id },
                    data: {
                        accessToken: access_token,
                        refreshToken: refresh_token || existingToken.refreshToken,
                        expiryDate,
                        tokenType: token_type || existingToken.tokenType,
                    },
                });
            }
            else {
                yield prisma.token.create({
                    data: {
                        accessToken: access_token,
                        refreshToken: refresh_token,
                        expiryDate,
                        tokenType: token_type || "Bearer", // Default to Bearer if undefined
                    },
                });
            }
            console.log("Tokens saved/updated successfully.");
        }
        catch (error) {
            console.error("Error saving tokens to database:", error);
        }
    });
}
// دالة لحفظ tokens في ملف JSON
// دالة لتحميل tokens من ملف JSON
function loadTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tokenData = yield prisma.token.findFirst();
            if (tokenData) {
                oAuth2Client.setCredentials({
                    access_token: tokenData.accessToken,
                    refresh_token: tokenData.refreshToken,
                    expiry_date: tokenData.expiryDate.getTime(),
                    token_type: tokenData.tokenType,
                });
            }
            else {
                console.log('No tokens found in the database, please authorize the app.');
            }
        }
        catch (error) {
            console.error('Error loading tokens from database:', error);
        }
    });
}
// استبدال Authorization Code بـ Access Token و Refresh Token
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/drive.file'],
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        // بعد أن تحصل على الكود من URL، قم بتبديله بالرموز
        try {
            const { tokens } = yield oAuth2Client.getToken(authorizationCode);
            oAuth2Client.setCredentials(tokens);
            saveTokens(tokens);
            console.log('Access Token and Refresh Token saved.');
        }
        catch (error) {
            console.error('Error retrieving access token:', error);
        }
    });
}
// تحديث Access Token تلقائيًا باستخدام Refresh Token
oAuth2Client.on('tokens', (tokens) => __awaiter(void 0, void 0, void 0, function* () {
    yield saveTokens(tokens);
    console.log('New tokens have been saved to the database.');
}));
// تحميل tokens عند بدء التشغيل
// تحديث Access Token تلقائيًا باستخدام Refresh Token
function refreshAccessTokenIfNeeded() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { access_token, refresh_token, expiry_date } = oAuth2Client.credentials;
            if (!access_token && refresh_token) {
                console.log('Access Token missing, attempting to refresh using refresh token.');
                const { credentials } = yield oAuth2Client.refreshAccessToken(); // Refresh token
                oAuth2Client.setCredentials(credentials); // Save new tokens
                yield saveTokens(credentials); // Save new tokens to the database
                console.log('Access Token has been refreshed and saved.');
            }
            else if (expiry_date && expiry_date < Date.now()) {
                console.log('Access Token is expired, refreshing...');
                const { credentials } = yield oAuth2Client.refreshAccessToken(); // Refresh token
                oAuth2Client.setCredentials(credentials); // Save new tokens
                yield saveTokens(credentials); // Save new tokens to the database
                console.log('Access Token has been refreshed.');
            }
            else {
                console.log('Access Token is valid.');
            }
        }
        catch (error) {
            console.error('Error refreshing access token:', error instanceof Error ? error.message : error);
        }
    });
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
    saveLectureDetails(name, numberOfLectures, price, contentId, isFree, subTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newLecture = yield prisma.lecture.create({
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
        });
    }
    uploadFilesToDrive(fileBuffers, fileNames, mimeType) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(fileBuffers.map((fileBuffer, index) => __awaiter(this, void 0, void 0, function* () {
                const passThrough = new stream_1.PassThrough();
                passThrough.end(fileBuffer);
                const response = yield drive.files.create({
                    requestBody: { name: fileNames[index], mimeType },
                    media: { mimeType, body: passThrough },
                });
                const fileId = response.data.id;
                return `https://drive.google.com/uc?id=${fileId}`;
            })));
        });
    }
    uploadVideosInBackground(lectureId, videoBuffers, videoNames, imageBuffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const videoUrls = yield this.uploadFilesToDrive(videoBuffers, videoNames, 'video/mp4');
            const imageUrl = (yield this.uploadFilesToDrive([imageBuffer], ['thumbnail'], 'image/jpeg'))[0];
            yield prisma.lecture.update({
                where: { id: lectureId },
                data: {
                    video: { create: videoUrls.map((url, index) => ({ url, name: videoNames[index] })) },
                    photoUrl: imageUrl,
                }
            });
        });
    } // رمز التفويض الذي حصلت عليه
    getTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // تبادل رمز التفويض للحصول على access_token و refresh_token
                const { tokens } = yield oAuth2Client.getToken(authorizationCode);
                oAuth2Client.setCredentials(tokens);
                console.log('Access Token:', tokens.access_token);
                console.log('Refresh Token:', tokens.refresh_token);
                // يمكنك الآن تخزين الـ refresh_token واستخدامه في المستقبل
                fs_1.default.writeFileSync('tokens.json', JSON.stringify(tokens));
            }
            catch (error) {
                console.error('Error retrieving access token', error);
            }
        });
    }
    getAllVideos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const videos = yield prisma.video.findMany();
                return videos;
            }
            catch (error) {
                console.error('Fetch Error:', error);
                throw new Error('Failed to fetch videos.');
            }
        });
    }
    getAlllecture() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lecture = yield prisma.lecture.findMany({
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
        });
    }
    getAllLecturesBycontentId(contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = yield prisma.courseContent.findUnique({
                    where: { id: contentId },
                    select: { content: true }
                });
                if (!content) {
                    throw new Error('Content not found.');
                }
                const lectures = yield prisma.lecture.findMany({
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
        });
    }
    deleteLecture(lectureId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.video.deleteMany({
                where: {
                    lectureId: lectureId
                }
            });
            yield prisma.lecture.delete({
                where: {
                    id: lectureId
                }
            });
        });
    }
}
const videoService = new VideoService();
exports.default = videoService;
