import app from "./app.js";
import connectDB from "./config/database.js";
import { env } from "./config/env.config.js";

const startServer = async () => {
    try {
        await connectDB();

        app.listen(env.PORT, () => {
            console.log("--------------------------------");
            console.log(`Server Running On Port ${env.PORT}`);
            console.log(`Environment : ${env.NODE_ENV}`);
            console.log("--------------------------------");
        });
    } catch (error) {
        console.error("Server Startup Failed");
        console.error(error.message);
    }
};

startServer();