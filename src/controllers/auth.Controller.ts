import { NextFunction } from "express";
import {successResponse } from "../middleware/response";
import { authValidation } from "./auth.validation";
import { jwtService } from "../services/jwt/jwt.service";
import { bcryptService } from "../services/bcrypt/bcrypt.services";

class authController {

    constructor(){

    }

     login = async (req : Request, res : Response, next : NextFunction) : Promise<any> => {

        const {email,password} = req.body as Partial<any>;
    }
}