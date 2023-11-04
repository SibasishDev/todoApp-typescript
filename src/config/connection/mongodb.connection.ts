
import mongoose from "mongoose";
import { config } from "../config";

mongoose.connect(config.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => console.log("Mongodb connected successfully"))
.catch((err) => console.log(err.message));

mongoose.connection.on("connected", () => console.log("Mongodb connected."));

mongoose.connection.on("error", (err) => console.log(err.message));

mongoose.connection.on("disconnected", () => console.log("Mongodb disconnected."));

process.on('SIGINT', async () => {
    console.log("sigint");
    await mongoose.connection.close();
    // await mongoose.disconnect();
    process.exit(0);
});