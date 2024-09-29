"use strict";
// src/controllers/videoController.ts
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideoController = void 0;
const fs = __importStar(require("fs"));
//import { uploadVideo } from '../services/test2';
const uploadVideoController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No video file provided');
        }
        // Write the uploaded video to a temp file
        const tempFilePath = `./uploads/${req.file.originalname}`;
        fs.writeFileSync(tempFilePath, req.file.buffer);
        // Send immediate response to the client
        res.status(202).json({ message: 'Video upload started, processing in background.' });
        // Upload the video in the background
        setImmediate(async () => {
            try {
                console.log(`start upload video`);
                //const videoUrl = await uploadVideo(tempFilePath);
                // Log success or store the URL in the database here
                // console.log(`Video uploaded successfully: ${videoUrl}`);
                // Clean up temp file after upload
                fs.unlinkSync(tempFilePath);
            }
            catch (error) {
                console.error('Error during background video upload:', error);
                // Clean up temp file on error
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
            }
        });
    }
    catch (error) {
        console.error('Video upload error:', error);
        return res.status(500).send('Failed to process video upload');
    }
};
exports.uploadVideoController = uploadVideoController;
//# sourceMappingURL=test2.js.map