import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        imageUrl:{
            type: String,
            required: true,
            trim: true,
        },

        publicId:{
            type: String,
            required: true,
            trim: true,
        },
        },{
        timestamps: true,
        },  
);

const Image = mongoose.model("Image", imageSchema);
export default Image;