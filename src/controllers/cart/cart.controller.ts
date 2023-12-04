import { Request, Response, NextFunction } from "express";
import { CartSchema } from "../../modal/cart/cart.modal";
import { ProductSchema } from "../../modal/product/product.modal";
import { successResponse } from "../../middleware/response";

interface CustomRequest extends Request {
    user: any;
}


class CartController {

    constructor() {

    }

    createCart = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {

            const { email } = req.user;

            const { productId, quantity } = req.body as Partial<any>;

            if (!productId || !quantity) return next({ code: 400, message: "productId and quantity required" });

            const productData = await ProductSchema.findById(productId);

            if (!productData) return next({ code: 400, message: "No product found" });

            const cart = await CartSchema.findOne({ email });

            const { priceAfterDiscount } = productData;

            if (cart) {
                const index = cart.items.findIndex((item) => item.product.toString() === productId.toString());

                if (index !== -1 && quantity <= 0) cart.items.splice(index, 1);
                else if (quantity > 0) {
                    cart.items.push({
                        product: productId,
                        totalProductQuantity: quantity,
                        totalProductPrice: priceAfterDiscount * quantity
                    });

                    cart.totalQuantity += quantity;
                    cart.totalPrice += priceAfterDiscount * quantity;
                } else {
                    return next({ code: 400, message: "Something went wrong" });
                }

                const updateCart = await CartSchema.updateOne({ email },
                    {
                        $set: { items: cart.items }
                    }, { new: true }
                )

                successResponse(res, 201, "item added successfully in to cart", updateCart);
            }

            //create cart

            const createCart = await CartSchema.create({
                email,
                items: [
                    {
                        product: productId,
                        totalProductQuantity: quantity,
                        totalProductPrice: priceAfterDiscount * quantity
                    }
                ],
                totalQuantity: quantity,
                totalPrice: priceAfterDiscount * quantity

            });

            if (!createCart) return next({ code: 400, message: "Something went wrong" });

            successResponse(res, 201, "item added successfully in to cart", createCart);

        } catch (e) {
            next(e);
        }
    }
}