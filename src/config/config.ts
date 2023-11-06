import dotenv from "dotenv";
dotenv.config();

class Config {

    PORT : number;
    JWT_SECRET : string;
    MONGO_DB_URL : any;
    JWT_REFRESH_SECRET : string;

    constructor(){
        this.PORT = +process.env.PORT! || 8000;
        this.JWT_SECRET = process.env.JWT_SECRET || "$#@secret-key#$";
        this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "$refresh-key@#";
        this.MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb+srv://dassibasishdas:bFlnhMCuW7huM0sk@cluster0.ss6mjmw.mongodb.net/";

    }
}

export const config = new Config();