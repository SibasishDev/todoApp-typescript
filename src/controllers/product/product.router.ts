import { Router, Request, Response} from "express";
import { productController } from "./product.controller";
import { anyMulter, singleFile } from "../../utils/multer";

class ProductRouter {
    router : any;
    constructor(){
        this.router = Router();
        this.init();
    }

    init(){
        this.router.post("/create-product",singleFile("file"), productController.createProduct);
    }

    getRouters(){
        return this.router;
    }
}

export const productRouter = new ProductRouter();