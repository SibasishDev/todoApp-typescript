import mongoose, { Document, Schema, Model } from "mongoose";

interface ICategory {
    name : string;
    description : string;
    image : string;
    imageId : string;

}

const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
        unique: true
      },
      description: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      imageId: {
        type: String,
        required: true
      }
    },
    {
      timestamps: true
});


export const CategorySchema : Model<ICategory & Document> = mongoose.model<ICategory & Document>("Category",categorySchema);