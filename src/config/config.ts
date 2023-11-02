import dotenv from "dotenv";
dotenv.config();

class Config {

    PORT : number;
    JWT_SECRET : string;

    constructor(){
        this.PORT = +process.env.PORT! || 8088;
        this.JWT_SECRET = process.env.JWT_SECRET || "$#secret-key@#"

    }
}

export const config = new Config();