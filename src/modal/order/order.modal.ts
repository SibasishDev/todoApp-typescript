import mongoose, { Document, Schema, Model, Types } from "mongoose";

interface OrderDocument extends Document{
    products : string[];
    user : string;
    totalPrice : number;
    isPaid : boolean;
    paidAt : any;
    isDelivered : boolean;
    deliveredAt : any;
    shippingAddress : string[];
    paymentMethod : string;
    paymentStripeId :string;
    taxPrice :string;
    shippingPrice : string;
    phone : string;
    status : string;

}

const orderSchema = new Schema<OrderDocument>({
    products: Array,
    user: {
      type: Types.ObjectId,
      ref: 'users'
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false
    },
    paidAt: {
      type: Date
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false
    },
    deliveredAt: {
      type: Date
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      required: true
    },
    paymentStripeId: {
      type: String
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    phone: {
      type: String,
      required: [true, 'Phone Is Required']
    },
    status: {
      type: String,
      default: 'Not Processed',
      enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    }
  },
  { timestamps: true}
  );

  export const OrderSchema : Model<OrderDocument> = mongoose.model<OrderDocument>("Order",orderSchema);