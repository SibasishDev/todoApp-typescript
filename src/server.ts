
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";

import { config } from "./config/config";
import { router } from "./routers/main.router";

class App {
    app : any;
    port : number;
    constructor (){
        this.app = express();
        this.port = config.PORT;
    }

    init(){
        this.addRoutesMiddlewares(this.app);
        this.listenPort(this.app,this.port);
    }

    addRoutesMiddlewares(app : any){
        app.use(express.json(),express.urlencoded({extended : true}));
        app.use(morgan("dev"));
        app.use(cors());
        app.use(helmet());
        app.use(bodyParser.json());

        app.use("/api", router.getRouters());
    }

    listenPort(app : any, port : number){
        app.listen(port, () => {
            console.log(`Server is listening to port : ${port} `)
        });
    }
}

export const app = new App();