import { NextFunction, Request, Response } from "express";
import { CategorySchema } from "../../modal/catgeory/category.modal";
import { categoryValidation } from "./category.validation";
import path from "path";
import { successResponse } from "../../middleware/response";

interface CustomRequest extends Request {
    user: any;
  }

class CategoryController {
    constructor () {

    }

    createCategory = async (req: CustomRequest, res : Response, next : NextFunction) : Promise<any> => {
        try{

            const {error,value} = categoryValidation.createCategory(req.body);

            if(error) return next({code : 400, message : error.message});

            if(!req.file) return next({code : 400, message : "Please upload a image"});

            const file = req.file?.path.replace(path.join(__dirname + "/../../")+"public", " ");
            
            value.image = file;

            const insertCategory = await CategorySchema.create(value);

            if(!insertCategory) return next({code : 400, message : "Something went wrong"});

            successResponse(res,201,"Category created successfully",insertCategory);

        }catch(e){
            next(e);
        }
    }

    getAllcategory = async (req : CustomRequest, res : Response, next : NextFunction) : Promise<any> => {
        try{

            const categories = await CategorySchema.find({},{_id : 1,name : 1,description: 1,image: 1});
            
            if(!categories.length) return next({code : 404, message : "No catgeory found"});

            successResponse(res,200,"Category found",categories);

        }catch(e){
            next(e);
        }
    }
}

export const categoryController = new CategoryController();