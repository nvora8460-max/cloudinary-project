import cloudinary from "../../config/cloudinary.config.js";
import ApiError from "../../utils/ApiError.js";
import * as imageRepository from "./image.reposatories.js";

const uploadBufferToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "cloudinary-crud/images",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(buffer);
    });
};

export const createImage = async({ title, file }) => {
    if (!file) {
        throw new ApiError(400, "Image file is required");
    }

    const uploadResult = await uploadBufferToCloudinary(file.buffer);

    const image = await imageRepository.createImage({
        title,
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
    });

    return image;
};

export const getAllImages = async () => {
    return await imageRepository.findAllImages();
};

export const getImageById = async (imageId) => {
    const image = await imageRepository.findImageById(imageId);

    if (!image) {
        throw new ApiError(404, "Image not found");
    }

    return image;
};

export const updateImage = async({ imageId, title, file }) => {
    const existingImage = await imageRepository.findImageById(imageId);

    if (!existingImage) {
        throw new ApiError(404, "Image not found");
    }

    const updateData = {};

    if (title !== undefined) {
        updateData.title = title;
    }

    if (file) {
        const uploadResult = await uploadBufferToCloudinary(file.buffer);

        updateData.imageUrl = uploadResult.secure_url;
        updateData.publicId = uploadResult.public_id;

        await cloudinary.uploader.destroy(existingImage.publicId);
    }

    const updatedImage = await imageRepository.updateImageById(
        imageId,
        updateData
    );

    return updatedImage;
};

export const deleteImage = async (imageId) => {
    const existingImage = await imageRepository.findImageById(imageId);

    if (!existingImage) {
        throw new ApiError(404, "Image not found");
    }

    await cloudinary.uploader.destroy(existingImage.publicId);

    await imageRepository.deleteImageById(imageId);

    return existingImage;
};