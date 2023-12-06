import Joi from "joi";


class OrderValidation {

    createOrder(data: any) {

        const shippingAddress = Joi.object({
            address : Joi.string().max(250).required(),
            city: Joi.string().required(),
            postalCode  : Joi.number().required(),
            country  : Joi.string().required(),
        });

        const schema = Joi.object({
            shippingAddress : shippingAddress.required(),
            paymentMethod   : Joi.number().required(),
            phone : Joi.number().required(),
        });
        
        return schema.validate(data);
    }
}

export const orderValidation = new OrderValidation();