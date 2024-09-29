import { Router } from "express";

import authRouter from "./authRouter";
//import CourseRouter from "./CourseRouter";
import googleDrive from "./googleDrive";
import videos from "./videos";
const router = Router();

router.use("/auth", authRouter);
//router.use("/CourseRouter", CourseRouter);
router.use("/googleDrive", googleDrive);
router.use("/videos", videos);

router.all("*", (req, res, next) => {
    res.status(404).json({status: false, message: `Endpoint not found: ${req.method} ${req.originalUrl}`});
})
export default router;