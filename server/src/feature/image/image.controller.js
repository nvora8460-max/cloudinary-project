import { z } from "zod";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import * as imageService from "./image.service.js";
import{
    createImageSchema,
    updateImageSchema,
} from "./image.validation.js";

export const createImage = asyncHandler(async (req,res) => {
    const { title } = createImageSchema.parse(req.body);

    const image= await imageService.createImage({
        title,
        file: req.file,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            "Image uploaded successfully",
            image
        )
    );
});


export const getAllImages = asyncHandler(async (req, res) => {
    const images = await imageService.getAllImages();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Images fetched successfully",
            images
        )
    );
});

export const getImageById = asyncHandler(async (req, res) => {
    const image = await imageService.getImageById(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Image fetched successfully",
            image
        )
    );   
})

export const updateImage = asyncHandler(async (req, res) => {
    const { title } = updateImageSchema.parse(req.body);

    const image = await imageService.updateImage({
        imageId: req.params.id,
        title,
        file: req.file,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Image updated successfully",
            image
        )
    );
});

export const deleteImage = asyncHandler(async (req, res) => {
    await imageService.deleteImage(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Image deleted successfully"
        )
    );
});