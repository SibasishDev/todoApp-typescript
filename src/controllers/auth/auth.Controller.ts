import { NextFunction, Request, Response } from "express";
import { successResponse } from "../../middleware/response";
import { authValidation } from "./auth.validation";
import { jwtService } from "../../services/jwt/jwt.service";
import { bcryptService } from "../../services/bcrypt/bcrypt.services";
import { User } from "../../modal/user.modal";
import { Uuid } from "../../modal/uuid.modal";
import { createUuid } from "../../services/uuid/uuid.service";

class AuthController {
  constructor() {}

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    // req.body as Partial<any>
    try {
      const { error, value } =  authValidation.login(req.body);

      if (error) return next({ code: 400, message: error.message });

      const checkUserExist = await User.findOne({"email" : value.email},{email : 1, _id : 1,password : 1});

      if(!checkUserExist) return next({code : 404, message : "Wrong email,user does not exist"});

      const matchPassword = await bcryptService.decryptPassword(value.password,checkUserExist.password);

      if(!matchPassword) return next({code : 400, message : "Wrong password!"});

      const uuid = createUuid();

      const accessToken = await jwtService.createToken(checkUserExist._id,checkUserExist.email,uuid);

      const refreshToken = await jwtService.createRefreshToken(checkUserExist._id);

      if(!accessToken && !refreshToken) return next({code : 400, message : "Error in generate token"});

      const CREATED_AT = new Date().getTime();
            
      const EXPIRES_AT = CREATED_AT + (24 * 60 * 60 * 1000);

      const uuidExist = await Uuid.findOne({"userId" : checkUserExist._id});

      if(!uuidExist) {
        const createUuid = await Uuid.create({
            userId : checkUserExist._id,
            uuid : [{
                _id : uuid,
                token : accessToken,
                createdAt : CREATED_AT,
                expireAt : EXPIRES_AT
            }]
        });

        if(!createUuid) return next({code : 400, message : "Something went wrong"});
        const data = {
            id : checkUserExist._id,
            email : checkUserExist.email,
            token : {accessToken, refreshToken}
      };

      return successResponse(res, 200, "login successfull", data);

      }

      const uuidArr = uuidExist.uuid;

      uuidArr.push({_id : uuid,token : accessToken, createdAt : CREATED_AT, expireAt : EXPIRES_AT});

      const updateUuid = await Uuid.updateOne({"userId" : checkUserExist._id},
      {
        $set : {
          uuid : uuidArr
        }
      });

      if(!updateUuid) return next({code : 400, message: "Something went wrong"});

      const data = {
            id : checkUserExist._id,
            email : checkUserExist.email,
            token : {accessToken,refreshToken}
      };

      return successResponse(res, 200, "login successfull", data);

    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { error, value } = authValidation.register(req.body);

      if (error) return next({ code: 400, message: error.message });

      const checkUserExist = await User.findOne({ email: value.email });

      if (checkUserExist)
        return next({ code: 400, message: "User already exist!" });

      value.password = await bcryptService.encryptPassword(value.password);

      delete value.repeatPassword;

      const user = await User.create(value);

      const data = {
        email: user.email,
        name: user.name,
        userName: user.username,
        mobile_no: user.phoneNo,
        role : +value.role
      };

      return successResponse(res, 201, "User created successfully", data);
    } catch (e) {
      next(e);
    }
  }


  
}

export const authController = new AuthController();
