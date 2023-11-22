import { Request, Response, NextFunction } from "express";
import { productValidation } from "./product.validation";
import { ProductSchema } from "../../modal/product/product.modal";
import { successResponse } from "../../middleware/response";
import { deleteImageFromBucket, uploadImageToBucket } from "../../utils/firebase/firebase-bucket";

interface CustomRequest extends Request {
    user: any;
    filePath: string;
}

class ProductController {

    constructor() {

    }

    createProduct = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            const { error, value } = productValidation.createProduct(req.body);

            if (error) return next({ code: 400, message: error.message });

            if (!req.file) return next({ code: 400, message: "Please upload a image" });

            const filePath = await uploadImageToBucket(req.file, "product");

            if (!filePath) return next({ code: 400, message: "Error in uploading image to bucket" });

            let priceAfterDiscount = +value.price;

            if (value.priceDiscount) priceAfterDiscount = +value.price - (+(value.price) / 100) * +value.priceDiscount;

            const createProducts = await ProductSchema.create({
                name: value.name,
                description: value.description,
                category: value.category,
                productImage: filePath,
                price: +value.price,
                priceDiscount: +value.priceDiscount,
                priceAfterDiscount: priceAfterDiscount,
                seller: req.user.id,
                quantity: +value.quantity,
                sold: +value.sold,
                isOutOfStock: value.isOutOfStock
            })

            if (!createProducts) return next({ code: 400, message: "Something went wrong" });

            successResponse(res, 201, "Product create successfully", createProducts);



        } catch (e) {
            next(e);
        }
    }

    getAllProducts = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {

            const page = +req.query?.page! || 1;

            const limit = +req.query?.limit! || 10;

            const sort = req.query?.sort as string || "";

            // const select = req.query?.select || "";

            const skip = (page - 1) * limit;

            const obj: any = {};

            if (sort) {

                let sortBy = sort.split(",");

                const number = +sortBy.shift()!;

                sortBy.map((elem) => {
                    obj[elem] = number;
                });
            }

            const productData = await ProductSchema.find().skip(skip).limit(limit).sort(obj);

            if (!productData.length) return next({ code: 400, message: "No products found" });

            successResponse(res, 200, "Product data fetch successfully", productData);

        } catch (e) {
            next(e);
        }
    }

    getProductById = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {

            const { productId } = req.body as Partial<any>;

            if (!productId) return next({ code: 400, message: "productId required" });

            const productData = await ProductSchema.findById({ _id: productId });

            if (!productData) return next({ code: 400, message: "No product found" });

            successResponse(res, 200, "Product fetch successfully", productData);

        } catch (e) {
            next(e);
        }
    }

    updatePoductDetails = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {

            const { productId, name, description, category, price, priceDiscount, quantity, sold, isOutOfStock } = req.body as Partial<any>;

            if (!productId) return next({ code: 400, message: "productId required" });

            const productData = await ProductSchema.findById({ _id: productId });

            if (!productData) return next({ code: 404, message: "No product found" });

            if (req.user.id.toString() !== productData.seller.toString()) return next({ code: 403, message: "You are not authorize to update" });

            const data: any = {};

            if (name) data.name = name;

            if (description) data.description = description;

            if (category) data.category = category;

            if (price) data.price = +price;

            if (priceDiscount) {
                data.priceDiscount = +priceDiscount;
                data.priceAfterDiscount = +productData.price - (+(productData.price) / 100) * +priceDiscount;
            }

            if (quantity) data.quantity = +productData.quantity;

            if (sold) data.sold = +productData.sold;

            if (isOutOfStock) data.isOutOfStock = isOutOfStock;

            const updateProduct = await ProductSchema.findByIdAndUpdate(productId, {
                $set: data
            }, { new: true });

            if (!updateProduct) return next({ code: 400, message: "Something went wrong" });

            successResponse(res, 200, "Product updated successfully", updateProduct);

        } catch (e) {
            next(e);
        }
    }

    updateProductImages = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {

            const { productId } = req.body as Partial<any>;

            if (!productId) return next({ code: 400, message: "productId required" });

            const productData = await ProductSchema.findById({ _id: productId });

            if (!productData) return next({ code: 404, message: "No product found" });

            if (req.user.id !== productData.seller) return next({ code: 403, message: "You are not authorize to update" });


            const filePath = await uploadImageToBucket(req.file, "product");

            if (!filePath) return next({ code: 400, message: "Error in uploading image to bucket" });

            const deleteOldImage = await deleteImageFromBucket(productData.productImage);

            const updateImagePath = await ProductSchema.findByIdAndUpdate(productId,
                {
                    $set: { productImage: filePath }
                }, { new: true });

                if (!updateImagePath) return next({ code: 400, message: "Something went wrong" });

                successResponse(res,200,"Image updated successfully", updateImagePath);


        } catch (e) {
            next(e);
        }
    }
}

export const productController = new ProductController();