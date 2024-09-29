import express, { NextFunction } from 'express';
import {config} from "dotenv"
import cors from "cors"
config();
import router from "./src/routers"
import globalError from "./src/middlewares/errorMiddleware"
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet';
import timeout from 'connect-timeout';
import session from 'express-session';
import passport from './src/services/passport';
import prisma from './prisma/client';

const app = express();
app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use( rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 150, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
	message:"too many requests from the server , please try again after an 15 minte"
}) ) 
app.use(helmet());
const corsOptions = {
	origin: "*", // Replace with your frontend URL
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	allowedHeaders: 'Content-Type,Authorization',
	credentials: true,
	optionsSuccessStatus: 204
}; 
app.use(cors(corsOptions));
app.use(timeout('10m'));

// Error handling middleware



app.use(express.json({ limit: '2gb' })); // أو الحد المطلوب
app.use(express.urlencoded({ limit: '2gb', extended: true }));

app.use("/api", router);
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use(globalError);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

const shutdown = async () => {
    console.log('Received shutdown signal, disconnecting Prisma...');
    await prisma.$disconnect();
    server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);