import { Router } from "express";

import authRouter from "./authRouter";
import userRouter from "./userRouter";
import adminRouter from "./adminRouter";
//import videoRouter from  "./videoRouter";
//import videoRouter1 from  "./videoRouter1";
import cartRouter from "./cartRouter";
import circulRouter from "./circulRouter";
import googleRouter from "./googleRouter";
import v from "./v";
const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/cart", cartRouter);
router.use("/cours" ,circulRouter )
router.use("/v" ,v )
router.use("/drive" ,googleRouter )
router.all("*", (req, res, next) => {
    res.status(404).json({status: false, message: `Endpoint not found: ${req.method} ${req.originalUrl}`});
})
export default router;