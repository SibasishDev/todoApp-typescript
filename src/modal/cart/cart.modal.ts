import mongoose, { Document, Schema, Model, Types } from "mongoose";

interface CartItem {
    product: mongoose.Types.ObjectId;
    // selectedColor: mongoose.Types.ObjectId;
    // selectedSize: mongoose.Types.ObjectId;
    totalProductQuantity: number;
    totalProductPrice: number;
  }
interface CartDocument extends Document{
    email : string;
    items : CartItem[];
    totalPrice : number;
    totalQuantity : number;
}

const cartSchema = new Schema<CartDocument>({
    email: {
        type: String,
        required: true,
        match: [
          /[\w]+?@[\w]+?\.[a-z]{2,4}/,
          'The value of path {PATH} ({VALUE}) is not a valid email address.'
        ]
      },
      items: [
        {
          product: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: true
          },
        //   selectedColor: {
        //     type: mongoose.Types.ObjectId,
        //     ref: 'Color',
        //     required: true
        //   },
        //   selectedSize: {
        //     type: mongoose.Types.ObjectId,
        //     ref: 'Size',
        //     required: true
        //   },
          totalProductQuantity: {
            type: Number,
            required: true
          },
          totalProductPrice: {
            type: Number,
            required: true
          }
        }
      ],
      totalPrice: {
        type: Number,
        required: true
      },
      totalQuantity: {
        type: Number,
        required: true
      }
    },
  { timestamps: true}
  );

  export const CartSchema : Model<CartDocument> = mongoose.model<CartDocument>("Cart",cartSchema);