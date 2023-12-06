
import { Request, Response, NextFunction } from "express";
import { orderValidation } from "./order.validations";
import { CartSchema } from "../../modal/cart/cart.modal";
import { ProductSchema } from "../../modal/product/product.modal";

interface CustomRequest extends Request {
    user: any;
}

class OrderController {

    constructor() {

    }

    createOrder = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {

            const { error, value } = orderValidation.createOrder(req.body);

            if (error) return next({ code: 400, message: error.message });

            const { email } = req.user;

            const cart = await CartSchema.findOne({ email });

            if (!cart || !cart.items.length) return next({ code: 404, message: "No cart found" });

            const { paymentMethod, phone, shippingAddress } = value;

            if(paymentMethod == "cash"){

                const createOrder = await CartSchema.create({
                    products : cart.items,
                    user : req.user._id,
                    totalPrice : cart.totalPrice,
                    paymentMethod,
                    shippingAddress,
                    phone
                });

                if(!paymentMethod) return next({code : 400, message : "Something went worng while placing order"});

                for(let item of cart.items){

                    const id = item.product;

                    const {totalProductQuantity} = item;

                    const product = await ProductSchema.findById(id);

                    if(!product) continue;

                    const sold = product?.sold + totalProductQuantity;

                    const quantity = product?.quantity - totalProductQuantity;

                    const updateProduct = await ProductSchema.findByIdAndUpdate(id, {$set : {sold, quantity}});

                }

                const deleteCart = await CartSchema.findByIdAndDelete(cart._id);
            }





        } catch (e) {
            next(e);
        }
    }
}

export const orderController = new OrderController();