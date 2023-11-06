import Joi from "joi";


class ProductValidation {

    createProduct(data: any) {
        const schema = Joi.object({
            name: Joi.string().max(250).min(3).required(),
            description : Joi.string().max(250).min(3).required(),
            // lastName: Joi.string().max(250).min(3).required(),
            category : Joi.string().required(),
            price : Joi.number().required(),
            priceDiscount  : Joi.number().required(),
            quantity  : Joi.number().required(),
            sold : Joi.number().required(),
            isOutOfStock : Joi.boolean().required(),
            // file : Joi.string().required()


            // dateOfBirth: Joi.date().iso().min('1980-01-01T00:00:00Z').max('2020-01-01T00:00:00Z').optional(),
            // type: Joi.string().valid(UserType.user, UserType.admin).optional().default(UserType.user),
        });

        return schema.validate(data);
    }
}

export const productValidation = new ProductValidation();
