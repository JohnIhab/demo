"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_1 = __importDefault(require("passport"));
const client_1 = __importDefault(require("../../prisma/client"));
const uuid_1 = require("uuid");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://bioscope-rosy.vercel.app/api/auth/google/redirect",
    scope: ["profile", "email"],
}, async (accessToken, refreshToken, profile, done) => {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        console.log('Profile:', profile);
        const user = await client_1.default.user.findUnique({
            where: { email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value },
        });
        if (user) {
            // تحديث معلومات المستخدم إذا لزم الأمر
            await client_1.default.user.update({
                where: { email: (_b = profile.emails) === null || _b === void 0 ? void 0 : _b[0].value },
                data: {
                    googleId: profile.id,
                    avatar: ((_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0].value) || user.avatar, // تحديث الصورة فقط إذا كانت جديدة
                },
            });
            return done(null, user);
        }
        const newUser = await client_1.default.user.create({
            data: {
                firstName: ((_d = profile.name) === null || _d === void 0 ? void 0 : _d.givenName) || '',
                lastName: ((_e = profile.name) === null || _e === void 0 ? void 0 : _e.familyName) || '',
                email: ((_f = profile.emails) === null || _f === void 0 ? void 0 : _f[0].value) || '',
                googleId: profile.id, // حفظ googleId في قاعدة البيانات
                password: (0, uuid_1.v4)(), // Generate a UUID as a placeholder password
                avatar: ((_g = profile.photos) === null || _g === void 0 ? void 0 : _g[0].value) || '',
                role: 'USER', // Default role
            },
        });
        console.log('New User:', newUser); // سجل بيانات المستخدم الجديد
        return done(null, newUser);
    }
    catch (error) {
        return done(error, false);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await client_1.default.user.findUnique({ where: { id: Number(id) } });
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map