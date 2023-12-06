import { Router, Request, Response, NextFunction } from "express";
import { cartController } from "./cart.controller";


class CartRoute {

    router : any;
    constructor(){
        this.router = Router();
        this.init();
    }

    init(){
        this.router.post("/add-to-cart", cartController.addItemToCart);
        this.router.patch("/remove-item-from-cart", cartController.removeItemInCart);
        this.router.get("/get-cart", cartController.getCart);
        this.router.delete("/delete-cart", cartController.deleteCart);
    }

     getRouters() {
        return this.router;
    }
}

export const cartRouter = new CartRoute();