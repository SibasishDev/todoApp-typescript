import { NextFunction ,Request,Response } from "express";
import {successResponse } from "../../middleware/response";
import { authValidation } from "./auth.validation";
import { jwtService } from "../../services/jwt/jwt.service";
import { bcryptService } from "../../services/bcrypt/bcrypt.services";

class AuthController {

    constructor(){

    }

     login = async (req : Request, res : Response, next : NextFunction) : Promise<any> => {
        // req.body as Partial<any>
        try{
        const {error,value} = await authValidation.register(req.body);
        if(error) return next({code : 400, message : error.message});
         successResponse(res,200,"login",[]);

        }catch(e){
            next(e);
        }
    }



}

export const authController = new AuthController();