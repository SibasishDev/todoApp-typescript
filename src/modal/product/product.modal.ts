import mongoose, { Document, Schema, Model, Types } from "mongoose";

interface ProductDocument extends Document {
  name: string;
  slug: string;
  mainImage: string;
  mainImageId: string;
  images: string[];
  imagesId: string[];
  description: string;
  category: Types.ObjectId;
  seller: Types.ObjectId;
  price: number;
  priceAfterDiscount: number;
  priceDiscount: number;
  colors: Types.ObjectId[];
  sizes: Types.ObjectId[];
  quantity: number;
  sold: number;
  isOutOfStock: boolean;
  ratingsAverage: number;
  ratingsQuantity: number;
}

const productSchema = new Schema<ProductDocument>({
        name: {
          type: String,
          required: [true, 'A product must have a name'],
          trim: true
        },
        slug: String,
        mainImage: {
          type: String,
          required: [true, 'A product must have a main image']
        },
        mainImageId: String,
        images: {
          type: [String],
          required: [true, 'A product must have sub images']
        },
        imagesId: Array,
        description: {
          type: String,
          required: [true, 'A product must have a description']
        },
        category: {
          type: Types.ObjectId,
          ref: 'Category'
        },
        seller: {
          type: Types.ObjectId,
          ref: 'User'
        },
        price: {
          type: Number,
          required: true,
          default: 0
        },
        priceAfterDiscount: {
          type: Number,
          required: true,
          default: 0
        },
        // priceDiscount: {
        //   type: Number,
        //   validate: {
        //     validator: function (value : number) {
        //       // this only points to current doc on NEW documnet creation
        //       return value < this.price;
        //     },
        //     message: 'Discount price ({VALUE}) should be below regular price'
        //   }
        // },
        // colors: [
        //   {
        //     type: mongoose.Types.ObjectId,
        //     ref: 'Color'
        //   }
        // ],
        // sizes: [
        //   {
        //     type: mongoose.Types.ObjectId,
        //     ref: 'Size'
        //   }
        // ],
        quantity: {
          type: Number,
          default: 0
        },
        sold: {
          type: Number,
          default: 0
        },
        isOutOfStock: {
          type: Boolean,
          default: false
        },
        ratingsAverage: {
          type: Number,
          default: 4.5,
          min: [1, 'Rating must be above 1.0'],
          max: [5, 'Rating must be below 5.0'],
          set: (val : number) => Math.round(val * 10) / 10
        },
        ratingsQuantity: {
          type: Number,
          default: 0
        }
      },
      {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
});



productSchema.index(
    { name: 1, category: 1, price: 1, ratingsAverage: -1 },
    { unique: true }
  );

//   productSchema.index({ slug: 1 });


//   productSchema.virtual('reviews', {
//     ref: 'Review',
//     foreignField: 'product',
//     localField: '_id',
//   });
  
//   // DOCUMENT MIDDLEWARE: runs before .save() and .create() !.update()
//   productSchema.pre('save', function (this: ProductDocument, next) {
//     this.slug = slugify(this.name, { lower: true });
//     next();
//   });

export const ProductSchema : Model<ProductDocument> = mongoose.model<ProductDocument>("Product",productSchema);