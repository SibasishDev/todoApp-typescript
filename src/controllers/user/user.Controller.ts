import { Request,Response,NextFunction } from "express";
import { Uuid } from "../../modal/uuid.modal";
import { successResponse } from "../../middleware/response";

interface CustomRequest extends Request {
    user: any;
  }
class UserController {
    constructor (){

    }

    test = async (req : CustomRequest, res : Response, next : NextFunction) : Promise<any> => {
        res.status(200).send(`Server is working`);
    }

    logout = async(req : CustomRequest, res : Response, next : NextFunction) : Promise<any> => {
        try{
            const {id,uuid} = req.user;

            const userData = await Uuid.findOne({"userId" : id});

            const index = userData?.uuid.findIndex((elem : any) => elem._id === uuid);

            if(index < 0) return next({code : 400, message : "token is expired"});

            userData?.uuid.splice(index,1);

            const updateUuid = await Uuid.updateOne({"userId" : id},
            {
                $set : {
                    uuid : userData?.uuid
                }
            });

            if(!updateUuid) return next({code : 400, message : "Something went wrong"});

            return successResponse(res,200,"user logout successfully");


        }catch(e){
            next(e);
        }
    }
}

export const userController = new UserController();