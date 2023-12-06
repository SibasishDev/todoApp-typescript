import { Router } from "express";
import { orderController } from "./order.controller";

class OrderRouter {

    router : any;

    constructor () {
        this.router = Router();
        this.init();
    }

    init(){

    }

    getRouters(){
        return this.router;
    }
}

export const orderRouter = new OrderRouter();