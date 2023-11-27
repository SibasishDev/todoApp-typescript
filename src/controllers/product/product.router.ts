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
        this.router.get("/get-all-products", productController.getAllProducts);
        this.router.get("/get-product-by-id", productController.getProductById);
        this.router.put("/update-product", productController.updatePoductDetails);
        this.router.put("/update-product-image", singleFile("file"), productController.updateProductImages);
        this.router.get("/top-5-products", productController.top5Product);
        this.router.get("/product-stats", productController.getProductStats);
        this.router.delete("/delete-product", productController.deleteProduct);
    }

    getRouters(){
        return this.router;
    }
}

export const productRouter = new ProductRouter();