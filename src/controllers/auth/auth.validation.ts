
import Joi from "joi";


class AuthValidation {

     /**
     * register: Validation for register.
     * @param data 
     * @returns 
     */
     register(data: any) {
        const schema = Joi.object({
            email: Joi.string().email().min(4).max(100).required(),
            password: Joi.string().min(5).max(100).required(),
            firstName: Joi.string().max(250).min(3).required(),
            lastName: Joi.string().max(250).min(3).required(),
            // dateOfBirth: Joi.date().iso().min('1980-01-01T00:00:00Z').max('2020-01-01T00:00:00Z').optional(),
            // type: Joi.string().valid(UserType.user, UserType.admin).optional().default(UserType.user),
        });

        return schema.validate(data);
    }

     /**
     * login: Validation for login.
     * @param data 
     * @returns 
     */
     login(data: any) {
        const schema = Joi.object({
            email: Joi.string().email().min(4).max(100).required(),
            password: Joi.string().min(5).max(100).required()
        });

        return schema.validate(data);
    }
}

export  const authValidation = new AuthValidation();