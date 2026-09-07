import { Router } from "express";
import imageRouter from "../feature/image/image.routes.js";


const router = Router();

router.get("/health", (req, res) => {
        res.status(200).json({
            success: true,
            message: "API is running successfully",
        });
    });
 router.use("/images", imageRouter);
    
 export default router;