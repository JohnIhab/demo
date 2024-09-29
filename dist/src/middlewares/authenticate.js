"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const ApiError_1 = __importDefault(require("../utils/ApiError")); // Adjust the import path as needed
const tokenUtils_1 = require("../utils/tokenUtils"); // Adjust the import path as needed
function authenticate(req, res, next) {
    // Example logic to extract user ID from token
    const userId = (0, tokenUtils_1.getUserIdFromToken)(req);
    console.log('Extracted User ID:', userId);
    if (userId) {
        req.user = userId;
        next();
    }
    else {
        next(new ApiError_1.default("User is not authenticated", 401));
    }
}
//# sourceMappingURL=authenticate.js.map