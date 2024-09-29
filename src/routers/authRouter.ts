import { Router } from "express";
import authController from "../controllers/authController";
import joiAsyncMiddleWare from "../middlewares/joiMiddleware";
import {
  registerValidationSchema,
  loginValidationSchema,
  verifyValidationSchema,
  resetValidationSchema ,
  forgetValidationSchema
} from "../validations/authValidations";
import passport from '../services/passport';
const router = Router();

router.post(
  "/signup",
  joiAsyncMiddleWare(registerValidationSchema),
  authController.signUpUser
);

router.post(
  "/login",
  joiAsyncMiddleWare(loginValidationSchema),
  authController.login
);
// بدء المصادقة عبر Google
router.get('/google', passport.authenticate('google' , { scope: ['profile', 'email'] }));

// التعامل مع فشل تسجيل الدخول
router.get('/login/failed', (req, res) => {
  res.status(401).json({ error: true, message: "login failure" });
});

// التعامل مع نجاح تسجيل الدخول
router.get('/login/success', async (req, res) => {
  if (req.user) {
    if (req.user) {
      const user = req.user as any;
      res.json({ 
          status: true,
          message: 'Login successful',
          token: user.token,
          user: user.user 
      });
  } else {
    return res.status(403).json({ error: false, message: "not Authorized" });
  }
}});

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

router.get('/google/redirect', passport.authenticate('google', {
  failureRedirect: "https://bioscope-rosy.vercel.app/api/auth/login/failed", 
}), authController.googleAuthCallback);

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }), 
  authController.googleAuthCallback  // استدعاء الدالة من controller
);


router.get("/verifyEmail",authController.verifyEmail);
router.post("/forget-password",joiAsyncMiddleWare(forgetValidationSchema) , authController.forgetPassword);
router.post("/verify-reset-code", authController.verifyResetCode);
router.post("/reset-password",joiAsyncMiddleWare(resetValidationSchema),authController.resetPassword);

export default router;
