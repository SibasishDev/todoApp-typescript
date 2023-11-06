import { Request, Response, NextFunction } from "express";
import { productValidation } from "./product.validation";
import { ProductSchema } from "../../modal/product/product.modal";
import path from "path";
import { successResponse } from "../../middleware/response";

interface CustomRequest extends Request {
    user: any;
  }

class ProductController {
    
    constructor () {

    }

    createProduct = async (req : CustomRequest , res : Response, next : NextFunction) : Promise<any> => {
        try{
            console.log(req.body);
            const {error, value} = productValidation.createProduct(req.body);

            if(error) return next({code : 400, message : error.message});

            if(!req.file) return next({code : 400, message : "Please upload a image"});

            const file = req.file?.path.replace(path.join(__dirname + "/../../")+"public", " ");
            let priceAfterDiscount = +value.price;

            if(value.priceDiscount) priceAfterDiscount = +value.price - (+(value.price)/ 100) * +value.priceDiscount;

            const createProducts = await ProductSchema.create({
                name : value.name,
                description : value.description,
                category : value.category,
                productImage : file.replace("\\","/"),
                price : +value.price,
                priceDiscount : +value.priceDiscount,
                priceAfterDiscount : priceAfterDiscount,
                seller : req.user.id,
                quantity : +value.quantity,
                sold: +value.sold,
                isOutOfStock : value.isOutOfStock
            }) 

            if(!createProducts) return next({code : 400, message : "Something went wrong"});

            successResponse(res,201,"Product create successfully",createProducts);



        }catch(e){
            next(e);
        }
    }
}

export const productController = new ProductController();