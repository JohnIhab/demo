"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const helmet_1 = __importDefault(require("helmet"));
const connect_timeout_1 = __importDefault(require("connect-timeout"));
const cors_1 = __importDefault(require("cors"));
(0, dotenv_1.config)();
const routers_1 = __importDefault(require("./src/routers"));
const errorMiddleware_1 = __importDefault(require("./src/middlewares/errorMiddleware"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
const corsOptions = {
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, connect_timeout_1.default)('10m'));
app.use(express_1.default.json({ limit: '2gb' })); // أو الحد المطلوب
app.use(express_1.default.urlencoded({ limit: '2gb', extended: true }));
app.use("/uploads", express_1.default.static("uploads"));
app.use("/assets", express_1.default.static("assets"));
app.use("/api", routers_1.default);
app.use(errorMiddleware_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
