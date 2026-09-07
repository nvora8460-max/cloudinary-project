import { Router } from "express";

import upload from "../../middleware/multer.middleware.js";

import { createImage, deleteImage, getAllImages, getImageById, updateImage } from "./image.controller.js";

const router = Router();

router.post("/", upload.single("image"), createImage);

router.get("/", getAllImages);

router.get("/:id", getImageById);

router.patch("/:id", upload.single("image"), updateImage);

router.delete("/:id", deleteImage);

export default router;