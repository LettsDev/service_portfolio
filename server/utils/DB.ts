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

  process.on("SIGINT", () => {
    mongoDisconnect();
    console.log("Mongoose connection closed due to application termination");
    process.exit(0);
  });
}

export async function mongoDisconnect() {
  await mongoose.disconnect();
  await mongoose.connection.close();
}

export async function DBConnect(mongoUri: string) {
  try {
    await mongoose.connect(mongoUri);
    console.log("connected to MongoDB");
    process.on("SIGINT", () => {
      mongoDisconnect();
      console.log("Mongoose connection closed due to application termination");
      process.exit(0);
    });
  } catch (error) {
    console.log("MongoDB connection error");
    console.error(error);
    process.exit(1);
  }
}
