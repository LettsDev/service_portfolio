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
  app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; script-src 'self' 'unsafe-eval'; font-src 'self' fonts.gstatic.com; img-src 'self' www.w3.org;"
    );

    next();
  });
  app.use(cors());
  app.use(cookieParser());
  app.use(deserializeUser);
  //routers
  app.use(express.static(path.join(__dirname, "..", "dist")));

  app.use("/api", ApiRouter);
  app.get("/health", (req, res) => {
    console.log("health check OK");
    return res.sendStatus(200);
  });
  app.get("*", (req, res) => {
    console.log("request received", req.headers);
    return res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
  });
  app.use(handleErrors);

  app.use(function (req, res, next) {
    next(createHttpError(404));
  });
  return app;
}

export default createServer;
