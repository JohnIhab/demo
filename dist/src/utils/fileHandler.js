"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFilesOnError = exports.removeFile = void 0;
const fs_1 = __importDefault(require("fs"));
const removeFile = (path) => {
    fs_1.default.unlink(path, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
};
exports.removeFile = removeFile;
const removeFilesOnError = (req) => {
    //Handling single file (Multer.single())
    if (req.file) {
        (0, exports.removeFile)(req.file.path);
    }
    else if (req.files) {
        //Handling multiple files (Multer.array())
        if (Array.isArray(req.files)) {
            req.files.forEach((file) => {
                (0, exports.removeFile)(file.path);
            });
        }
        else {
            //Handling multiple files (Multer.fields())
            for (const key in req.files) {
                const files = req.files[key];
                files.forEach((file) => {
                    (0, exports.removeFile)(file.path);
                });
            }
        }
    }
};
exports.removeFilesOnError = removeFilesOnError;
