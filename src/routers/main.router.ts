
import { Router, Request, Response} from "express";
import { errorResponse } from "../middleware/response";

class mainRouter {
    router : any;
    constructor () {
        this.router = Router();
        this.init();
    }

    init(){
        this.router.use(errorResponse);
    }

    getRouters(){
        return this.router;
    }
}

export const router = new mainRouter();