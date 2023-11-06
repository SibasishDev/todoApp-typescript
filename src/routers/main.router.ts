
import { Router, Request, Response} from "express";
import { errorResponse } from "../middleware/response";
import {authRouter} from "../controllers/auth/auth.router";
import { verifyAccessToken } from "../middleware/auth.middleware";
import {userRouter} from "./user.route";
import { productRouter } from "../controllers/product/product.router";
import { categoryRouter } from "../controllers/category/category.router";

class mainRouter {
    router : any;
    constructor () {
        this.router = Router();
        this.init();
    }

    init(){
    
        this.router.use("/",authRouter.getRouters());

        this.router.use(verifyAccessToken);

        this.router.use("/user", userRouter.getRouters());

        this.router.use("/product", productRouter.getRouters());

        this.router.use("/category", categoryRouter.getRouters());

        this.router.use("*", (req : Request, res : Response) => {
           return res.status(404).json({
                code : 404,
                message : "Not Found"
            })
        });
    }

    getRouters(){
        return this.router;
    }
}

export const router = new mainRouter();