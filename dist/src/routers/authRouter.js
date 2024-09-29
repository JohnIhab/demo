"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const authValidations_1 = require("../validations/authValidations");
const passport_1 = __importDefault(require("../services/passport"));
const router = (0, express_1.Router)();
router.post("/signup", (0, joiMiddleware_1.default)(authValidations_1.registerValidationSchema), authController_1.default.signUpUser);
router.post("/login", (0, joiMiddleware_1.default)(authValidations_1.loginValidationSchema), authController_1.default.login);
// بدء المصادقة عبر Google
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
// التعامل مع فشل تسجيل الدخول
router.get('/login/failed', (req, res) => {
    res.status(401).json({ error: true, message: "login failure" });
});
// التعامل مع نجاح تسجيل الدخول
router.get('/login/success', async (req, res) => {
    if (req.user) {
        if (req.user) {
            const user = req.user;
            res.json({
                status: true,
                message: 'Login successful',
                token: user.token,
                user: user.user
            });
        }
        else {
            return res.status(403).json({ error: false, message: "not Authorized" });
        }
    }
});
// تسجيل الخروج
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: true, message: "Logout failed" });
        }
        res.redirect('/');
    });
});
// إعادة التوجيه بعد المصادقة عبر Google
router.get('/google/redirect', passport_1.default.authenticate('google', {
    failureRedirect: "https://bioscope-rosy.vercel.app/api/auth/login/failed",
}), authController_1.default.googleAuthCallback);
router.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), authController_1.default.googleAuthCallback // استدعاء الدالة من controller
);
router.get("/verifyEmail", authController_1.default.verifyEmail);
router.post("/forget-password", (0, joiMiddleware_1.default)(authValidations_1.forgetValidationSchema), authController_1.default.forgetPassword);
router.post("/verify-reset-code", authController_1.default.verifyResetCode);
router.post("/reset-password", (0, joiMiddleware_1.default)(authValidations_1.resetValidationSchema), authController_1.default.resetPassword);
exports.default = router;
//# sourceMappingURL=authRouter.js.map