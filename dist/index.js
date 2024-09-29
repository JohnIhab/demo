"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
(0, dotenv_1.config)();
const routers_1 = __importDefault(require("./src/routers"));
const errorMiddleware_1 = __importDefault(require("./src/middlewares/errorMiddleware"));
const express_rate_limit_1 = require("express-rate-limit");
const helmet_1 = __importDefault(require("helmet"));
const connect_timeout_1 = __importDefault(require("connect-timeout"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("./src/services/passport"));
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 150,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: "too many requests from the server , please try again after an 15 minte"
}));
app.use((0, helmet_1.default)());
const corsOptions = {
    origin: "*", // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, connect_timeout_1.default)('60000'));
// Error handling middleware
app.use(express_1.default.json({ limit: '100mb' }));
app.use(express_1.default.urlencoded({ limit: '100mb', extended: true }));
app.use("/api", routers_1.default);
app.use("/uploads", express_1.default.static("uploads"));
app.use("/assets", express_1.default.static("assets"));
app.use(errorMiddleware_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
