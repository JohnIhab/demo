"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideo = void 0;
const aws_1 = __importDefault(require("./aws"));
const uploadVideo = async (filePath) => {
    return new Promise((resolve, reject) => {
        aws_1.default.v2.uploader.upload(filePath, { resource_type: 'video' }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve((result === null || result === void 0 ? void 0 : result.secure_url) || '');
        });
    });
};
exports.uploadVideo = uploadVideo;
//# sourceMappingURL=cloudinry.js.map