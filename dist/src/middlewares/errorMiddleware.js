"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const fileHandler_1 = require("../utils/fileHandler");
exports.default = (err, req, res, next) => {
    if (req.file || req.files) {
        (0, fileHandler_1.removeFilesOnError)(req);
    }
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === "development") {
        (0, response_1.default)(res, err.statusCode, { status: false, message: err.message, stack: err.stack });
    }
    else {
        (0, response_1.default)(res, err.statusCode, { status: false, message: err.message });
    }
};
//# sourceMappingURL=errorMiddleware.js.map