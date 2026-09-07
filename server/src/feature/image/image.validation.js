import { z } from "zod";

export const createImageSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Title must be at least 2 characters")
        .max(100, "Title cannot exceed 100 characters"),
});

export const updateImageSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Title must be at least 2 characters")
        .max(100, "Title cannot exceed 100 characters")
        .optional(),
});