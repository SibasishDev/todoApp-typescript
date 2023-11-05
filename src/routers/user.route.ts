import { Router } from "express";
import { userController } from "../controllers/user/user.controller";


class UserRouter {
    router : any;
    constructor (){
        this.router = Router();
        this.init();
    }

    init(){
        this.router.get("/test",userController.test);
        this.router.get("/logout", userController.logout);
    }

    getRouters(){
        return this.router;
    }
}

export const userRouter = new UserRouter();