import { Router, Response } from "express";
import {authController} from "./auth.Controller";

class AuthRouter {

    router : any;
    constructor(){
        this.router = Router();
        this.init();
    }

    init(){
        this.router.post("/login", authController.login);

    }

    getRouters(){
        return this.router;
    }
}


export const authRouter = new AuthRouter();