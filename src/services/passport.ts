import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import prisma from "../../prisma/client";
import { v4 as uuidv4 } from 'uuid';
import {config} from "dotenv"
config();
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "https://bioscope-rosy.vercel.app/api/auth/google/redirect" ,
    scope: ["profile", "email"],
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('Profile:', profile); 
        const user = await prisma.user.findUnique({
            where: { email: profile.emails?.[0].value },
        });

        if (user) {
            // تحديث معلومات المستخدم إذا لزم الأمر
                await prisma.user.update({
                where: { email: profile.emails?.[0].value },
                data: {
                    googleId: profile.id,
                    avatar: profile.photos?.[0].value || user.avatar, // تحديث الصورة فقط إذا كانت جديدة
                },
            });
            return done(null, user);
        }

        const newUser = await prisma.user.create({
            data: {
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            email: profile.emails?.[0].value || '',
            googleId: profile.id, // حفظ googleId في قاعدة البيانات
            password: uuidv4(), // Generate a UUID as a placeholder password
            avatar: profile.photos?.[0].value || '',
            role: 'USER', // Default role
            },
        });
        console.log('New User:', newUser); // سجل بيانات المستخدم الجديد
        return done(null, newUser);
        } catch (error) {
        return done(error, false);
        }
    }
));

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;