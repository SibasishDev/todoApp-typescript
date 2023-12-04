import { Router, Request, Response} from "express";
import { categoryController } from "./category.controller";
import { anyMulter, singleFile } from "../../utils/multer";

class CategoryRouter {
    router : any;
    constructor(){
        this.router = Router();
        this.init();
    }

    init(){
        this.router.post("/create-category",singleFile("file"), categoryController.createCategory);
        this.router.get("/get-all-category", categoryController.getAllcategory);
        this.router.put("/update-category", categoryController.updateCategory);
        this.router.put("update-category-image",singleFile("file"), categoryController.updateCategoryImage);
    }

    getRouters(){
        return this.router;
    }
}

export const categoryRouter = new CategoryRouter();