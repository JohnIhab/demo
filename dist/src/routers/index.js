"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter_1 = __importDefault(require("./authRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const adminRouter_1 = __importDefault(require("./adminRouter"));
//import videoRouter from  "./videoRouter";
//import videoRouter1 from  "./videoRouter1";
const cartRouter_1 = __importDefault(require("./cartRouter"));
const circulRouter_1 = __importDefault(require("./circulRouter"));
const googleRouter_1 = __importDefault(require("./googleRouter"));
const v_1 = __importDefault(require("./v"));
const router = (0, express_1.Router)();
router.use("/auth", authRouter_1.default);
router.use("/user", userRouter_1.default);
router.use("/admin", adminRouter_1.default);
router.use("/cart", cartRouter_1.default);
router.use("/cours", circulRouter_1.default);
router.use("/v", v_1.default);
router.use("/drive", googleRouter_1.default);
router.all("*", (req, res, next) => {
    res.status(404).json({ status: false, message: `Endpoint not found: ${req.method} ${req.originalUrl}` });
});
exports.default = router;
//# sourceMappingURL=index.js.map