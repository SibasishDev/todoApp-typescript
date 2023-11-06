import Joi from "joi";

class CategoryValidation{
     createCategory(data : any){
        const schema = Joi.object({
            name: Joi.string().max(250).min(3).required(),
            description : Joi.string().max(250).min(3).required()
        });

        return schema.validate(data);
     }
}

export const categoryValidation = new CategoryValidation();