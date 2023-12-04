import { NextFunction, Request, Response } from "express";
import { CategorySchema } from "../../modal/catgeory/category.modal";
import { categoryValidation } from "./category.validation";
import { uploadImageToBucket, deleteImageFromBucket } from "../../utils/firebase/firebase-bucket";
import { successResponse } from "../../middleware/response";

interface CustomRequest extends Request {
    user: any;
}

class CategoryController {
    constructor() {

    }

    createCategory = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {

            const { error, value } = categoryValidation.createCategory(req.body);

            if (error) return next({ code: 400, message: error.message });

            if (!req.file) return next({ code: 400, message: "Please upload a image" });

            const filePath = await uploadImageToBucket(req.file, "category");

            if (!filePath) return next({ code: 400, message: "Error in uploading image to bucket" });

            value.image = filePath;

            const insertCategory = await CategorySchema.create(value);

            if (!insertCategory) return next({ code: 400, message: "Something went wrong" });

            successResponse(res, 201, "Category created successfully", insertCategory);

        } catch (e) {
            next(e);
        }
    }

    getAllcategory = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {

            const categories = await CategorySchema.find({}, { _id: 1, name: 1, description: 1, image: 1 });

            if (!categories.length) return next({ code: 404, message: "No catgeory found" });

            successResponse(res, 200, "Category found", categories);

        } catch (e) {
            next(e);
        }
    }

    updateCategory = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {

            const { categoryId, name, description } = req.body as Partial<any>;

            if (!categoryId) return next({ code: 400, message: "categoryId required" });

            const categoryExist = await CategorySchema.findById(categoryId);

            if (!categoryExist) return next({ code: 404, message: "Category not found" });

            const data: any = {};

            if (name) data.name = name;

            if (description) data.description = description;

            const updateCategory = await CategorySchema.findByIdAndUpdate(categoryId, {
                $set: data
            }, { new: true });

            if (!updateCategory) return next({ code: 400, message: "Something went wrong" });

            successResponse(res, 200, "Category updated successfully", updateCategory);

        } catch (e) {
            next(e);
        }
    }

    updateCategoryImage = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            
            const {categoryId} = req.body as Partial<any>;

            if(!categoryId) return next({code : 400, message : "categoryId required"});

            const checkCategoryExists = await CategorySchema.findById(categoryId);

            if(!checkCategoryExists) return next({code : 404, message : "category not found"});

            if (!req.file) return next({ code: 400, message: "Please upload a image" });

            const filePath = await uploadImageToBucket(req.file, "category");

            if (!filePath) return next({ code: 400, message: "Error in uploading image to bucket" });

            const updateCategory = await CategorySchema.updateOne({_id : categoryId},{$set : {image : filePath},},{new : true});

            if(!updateCategory) return next({code : 400, message : "Something went wrong"});

            successResponse(res,200,"Category image updated",updateCategory);

        } catch (e) {
            next(e);
        }
    }

    deleteCategory = async (req : CustomRequest, res : Response, next : NextFunction) : Promise<any> => {
        try{

            const {categoryId} = req.body as Partial<any>;

            if(!categoryId) return next({code : 400, message : "categoryId required"});

            const checkCategoryExists = await CategorySchema.findById(categoryId);

            if(!checkCategoryExists) return next({code : 404, message : "category not found"});

            const deleteProdutImage = await deleteImageFromBucket(checkCategoryExists.image);

            const deleteCategoryData = await CategorySchema.findByIdAndDelete({_id : categoryId});

            successResponse(res,200,"Category deleted successfully");

        }catch(e){
            next(e);
        }
    }
}

export const categoryController = new CategoryController();