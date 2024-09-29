"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const multer_1 = __importDefault(require("../middlewares/multer"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const authValidations_1 = require("../validations/authValidations");
const router = (0, express_1.Router)();
router.post("/signup", multer_1.default.single("avatar"), (0, joiMiddleware_1.default)(authValidations_1.registerValidationSchema), authController_1.default.signUpUser);
router.post("/login", 
//joiAsyncMiddleWare(loginValidationSchema),
authController_1.default.login);
router.post("/add-users", authController_1.default.addUsers);
router.post("/forget-password", authController_1.default.forgetPassword);
router.post("/verify-reset-code", authController_1.default.verifyResetCode);
router.post("/reset-password", authController_1.default.resetPassword);
exports.default = router;
