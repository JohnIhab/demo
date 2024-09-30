import express from 'express';
import {config} from "dotenv"
import helmet from 'helmet';
import timeout from 'connect-timeout';
import cors from "cors"
config();
import router from "./src/routers"
import globalError from "./src/middlewares/errorMiddleware"

const app = express();

app.use(cors());

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
app.use(express.json({ limit: '2gb' })); // أو الحد المطلوب
app.use(express.urlencoded({ limit: '2gb', extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));

app.use("/api", router);

app.use(globalError);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});