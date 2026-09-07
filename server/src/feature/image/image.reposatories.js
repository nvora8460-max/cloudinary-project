import Image from "./image.model.js";

export const createImage = async (imageData) => {
    return await Image.create(imageData);
};

export const findAllImages = async () => {
    return await Image.find().sort({ createdAt: -1 });
};

export const findImageById = async (imageId) => {
    return await Image.findById(imageId);
};

export const updateImageById = async (imageId, updateData) => {
    return await Image.findByIdAndUpdate(imageId, updateData, {
        new: true,
        runValidators: true,
    });
};

export const deleteImageById = async (imageId) => {
    return await Image.findByIdAndDelete(imageId);
};