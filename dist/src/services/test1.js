"use strict";
/*import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { PassThrough } from 'stream';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

// إعداد Prisma Client
const prisma = new PrismaClient();

// إعداد OAuth2Client باستخدام المتغيرات من ملف .env
const credentialsPath = path.join(__dirname, '../../client_secret_1039648523863-05fo07bbgij6rrurc9st45l92seh3b5k.apps.googleusercontent.com.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// مسار تخزين التوكنات

// دالة لحفظ التوكنات في قاعدة بيانات PostgreSQL
async function saveTokens(tokens: any) {
    const expiryDate = tokens.expiry_date ? new Date(tokens.expiry_date) : new Date();

    if (isNaN(expiryDate.getTime())) {
        console.error('Invalid expiry date:', tokens.expiry_date);
        throw new Error('Invalid expiry date');
    }

    await prisma.token.create({
        data: {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiryDate: expiryDate,
            tokenType: tokens.token_type || 'Bearer',
        },
    });
    console.log('Tokens saved to PostgreSQL successfully.');

    // حذف ملف التوكنات إذا كنت ترغب في ذلك
}


// استبدال Authorization Code بـ Access Token و Refresh Token
async function getAccessToken(authorizationCode: string) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/drive.file'],
    });

    console.log('Authorize this app by visiting this url:', authUrl);

    // بعد أن تحصل على الكود من URL، قم بتبديله بالرموز
    try {
        const { tokens } = await oAuth2Client.getToken(authorizationCode);
        oAuth2Client.setCredentials(tokens);
        await saveTokens(tokens);
        console.log('Access Token and Refresh Token saved.');
    } catch (error) {
        console.error('Error retrieving access token:', error);
    }
}

// دالة لتحميل التوكنات من قاعدة بيانات PostgreSQL
async function loadTokens() {
    const tokens = await prisma.token.findFirst(); // ابحث عن أول سجل في جدول التوكنات
    if (tokens) {
        oAuth2Client.setCredentials({
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            expiry_date: tokens.expiryDate.getTime(), // تأكد من تحويل التاريخ إلى timestamp
        });
        console.log('Tokens loaded from database');
        return tokens; // أعد الرموز
    } else {
        console.log('No tokens found, please authorize the app.');
        return null; // أعد null إذا لم توجد الرموز
    }
}

// الدالة الرئيسية
async function main() {
    const tokens = await loadTokens();
    if (!tokens) {
        // استبدل Authorization Code هنا عند الحاجة
        const authorizationCode = 'YOUR_AUTHORIZATION_CODE'; // قم بإدخال الكود الجديد هنا
        await getAccessToken(authorizationCode);
    } else {
        console.log('Tokens are available, you can use them.');
    }
}

// دالة لتحميل الفيديو إلى Google Drive
export const uploadVideoToGoogleDrive = async (fileBuffer: Buffer, fileName: string) => {
    try {
        const fileMetadata = {
            name: fileName,
        };

        const bufferStream = new PassThrough();
        bufferStream.end(fileBuffer);

        const media = {
            mimeType: 'video/mp4', // Assuming the file is mp4, adjust as needed
            body: bufferStream,
        };

        const response = await google.drive({ version: 'v3', auth: oAuth2Client }).files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, webContentLink, webViewLink',
        });

        console.log('Video uploaded successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    }
};

// تنفيذ الوظائف عند بدء التشغيل
main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
*/ 
//# sourceMappingURL=test1.js.map