"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/videoRoutes.ts
const express_1 = require("express");
const videos_1 = require("../controllers/videos");
const router = (0, express_1.Router)();
// Define the route for file uploads
router.post('/upload', videos_1.uploadMiddleware, videos_1.uploadFiles);
router.post('/uploads', videos_1.uploadMiddleware, videos_1.uploadFiless);
exports.default = router;
