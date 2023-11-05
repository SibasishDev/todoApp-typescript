import mongoose from "mongoose";
import { config } from "../config";

class MongoDB {
  MONGO_DB_URL: string;
  constructor() {
    this.MONGO_DB_URL = config.MONGO_DB_URL;
  }

  async connect() {
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(config.MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
      console.log("Mongodb Connected");
    } catch (error) {
      console.error(error);
      setTimeout(async () => {
        console.log("Retrying after error");
        await this.connect();
      }, 1000);
    }

    // mongoose.connection.on("connected", () => console.log("Mongodb connected."));

    // mongoose.connection.on("error", (err) => console.log(err.message));

    // mongoose.connection.on("disconnected", () => console.log("Mongodb disconnected."));

    process.on("SIGINT", async () => {
      console.log("sigint");
      await mongoose.connection.close();
      // await mongoose.disconnect();
      process.exit(0);
    });
  }
}

export const mongoDB = new MongoDB();
