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

    /**
 * @desc      Add Product To Cart Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.user.email - User email
 * @property  { String } req.body.productId - Product ID
 * @property  { Number } req.body.quantity - Product quantity
 * @returns   { JSON } - A JSON object representing the type, message, and the cart
 */

    addItemToCart = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
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
                else if (index == -1 && quantity > 0) {

                    const newCartItem = {
                        product: productId,
                        totalProductQuantity: quantity,
                        totalProductPrice: priceAfterDiscount * quantity
                    }

                    cart.items.push(newCartItem);

                    cart.totalQuantity += quantity;

                    cart.totalPrice += newCartItem.totalProductPrice;

                } else if (index !== -1 && quantity > 0) {

                    const updateItem = cart.items[index];

                    updateItem.totalProductQuantity += quantity;

                    updateItem.totalProductPrice += priceAfterDiscount * quantity;

                    cart.totalQuantity += quantity;

                    cart.totalPrice += priceAfterDiscount * quantity;

                }
                else {
                    
                    return next({ code: 400, message: "Invalid quantity" });
                }

                const updateCart = await CartSchema.findOneAndUpdate({ email },
                    {
                        $set: { items: cart.items, totalQuantity: cart.totalQuantity, totalPrice: cart.totalPrice }
                    }, { new: true }
                )

                return successResponse(res, 201, "Item added successfully in to cart", updateCart);
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


    /**
* @desc      Remove Product Quantity 
* @param     { Object } req - Request object
* @param     { Object } res - Response object
* @property  { String } req.user.email - User email
* @property  { String } req.body.productId - Product ID
* @property  { Number } req.body.quantity - Product quantity
* @returns   { JSON } - A JSON object representing the type, message, and the cart
*/

    removeItemInCart = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {

            const { productId, number } = req.body as Partial<any>;

            if (!productId && !number) return next({ code: 400, message: "productId and number required" });

            const { email } = req.user;

            const cartData = await CartSchema.findOne({ email });

            if (!cartData) return next({ code: 404, message: "No cart found" });

            const productData = await ProductSchema.findById(productId);

            if (!productData) return next({ code: 400, message: "No product found" });

            const { priceAfterDiscount } = productData;

            const index = cartData.items.findIndex((elem) => elem.product.toString() === productId.toString());

            if (index == -1) return next({ code: 404, message: "No product found in cart" });

            const quantityInCart = cartData.items[index].totalProductQuantity;

            if (quantityInCart > number) {

                cartData.items[index].totalProductQuantity -= number;

                cartData.items[index].totalProductPrice -= priceAfterDiscount * number;

                cartData.totalQuantity -= number;

                cartData.totalPrice -= priceAfterDiscount * number;

            } else if (quantityInCart == number) {

                cartData.items.splice(index, 1);

                cartData.totalQuantity -= number;

                cartData.totalPrice -= priceAfterDiscount * number;

            } else {

                return next({ code: 400, message: "Invalid quantity" });
            }

            const updateCart = await CartSchema.findOneAndUpdate({ email },
                {
                    $set: { items: cartData.items, totalQuantity: cartData.totalQuantity, totalPrice: cartData.totalPrice }
                }, { new: true });

            if (!updateCart) return next({ code: 400, message: "Soemthing went wrong" });

            successResponse(res, 200, "Item removed successfully", updateCart);


        } catch (e) {
            next(e);
        }
    }
}

export const cartController = new CartController();