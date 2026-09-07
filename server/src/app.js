import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { env } from "./config/env.config.js";
import router from "./routes/index.js";
import errorMiddleware from "./middleware/error.middleware.js";


const app =express();

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
    }),
);

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

if (env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
}

app.use("/api" , router);
app.use(errorMiddleware);

export default app;