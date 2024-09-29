"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
exports.default = (path) => {
    // const pathArray = path.split('/');
    // let currentPath = '';
    // pathArray.forEach((folder) => {
    //     currentPath += folder + '/';
    //     if (!checkIfFolderExists(currentPath)) {
    //         fs.mkdirSync(currentPath);
    //     }
    // });
    if (!fs_1.default.existsSync(path)) {
        fs_1.default.mkdirSync(path, { recursive: true });
    }
};
const checkIfFolderExists = (path) => {
    return fs_1.default.existsSync(path);
};
//# sourceMappingURL=folderHandler.js.map