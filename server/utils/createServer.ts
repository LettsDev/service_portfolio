import express from "express";
import createHttpError from "http-errors";
import logger from "morgan";
import helmet from "helmet";
import ApiRouter from "../apiRouter";
import deserializeUser from "../middleware/deserializeUser";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import handleErrors from "../middleware/handleErrors";
import path from "path";
function createServer() {
  const app = express();
  app.use(express.json());
  app.use(helmet());
  app.use(logger("dev"));

  app.use(express.urlencoded({ extended: true }));

  app.use(cors({ credentials: true }));
  app.use(cookieParser());
  app.use(deserializeUser);
  //routers

  app.use("/api", ApiRouter);
  app.get("/health", (req, res) => {
    return res.sendStatus(200);
  });
  // TODO create error handling middleware that the controller will pass errors to
  app.use(handleErrors);
  //   app.use(express.static(path.join(__dirname, "client", "dist")));

  app.use(function (req, res, next) {
    next(createHttpError(404));
  });
  return app;
}

export default createServer;
