import "dotenv/config";
import { MongooseError } from "mongoose";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export async function memoryConnect() {
  const MongoServer = await MongoMemoryServer.create();
  const mongoUri = MongoServer.getUri();

  await mongoose.connect(mongoUri);

  mongoose.set("strictQuery", false);

  mongoose.connection.on("error", (e: MongooseError) => {
    if (e.message === "ETIMEDOUT") {
      console.log(e);
      mongoose.connect(mongoUri);
    }
    console.log(e);
    process.exit(1);
  });
  console.log("connected to memory server");
}

export async function memoryDisconnect() {
  await mongoose.disconnect();
  await mongoose.connection.close();
}
