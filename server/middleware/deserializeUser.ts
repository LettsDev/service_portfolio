import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/auth";
import { reIssueAccessToken } from "../service/session.service";
import { get } from "lodash";
import "dotenv/config";
const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //check if client has correct tokens, then assign user to local variable
  const accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
  const refreshToken =
    get(req, "cookies.refreshToken") ||
    (get(req, "headers.x-refresh") as string);

  if (!refreshToken) {
    return next();
  }
  //no access token(or expired / not valid) -> reissue access token
  const accessTokenResult = verifyJWT(accessToken as string);
  if (accessTokenResult.expired || !accessTokenResult.valid) {
    // reIssueAccessToken will verify: refresh token , valid session
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
      res.cookie("accessToken", newAccessToken, {
        maxAge: 36e5, //1 hour
        httpOnly: true,
        domain: process.env.DOMAIN as string,
        path: "/",
        sameSite: "strict",
        secure: process.env.SECURE === "true",
      });
    }
    const result = verifyJWT(newAccessToken as string);
    res.locals.user = result.decoded;
    return next();
  }
  //happy path -> have refresh and access
  if (accessTokenResult.decoded) {
    res.locals.user = accessTokenResult.decoded;
    return next();
  }
  return next();
};
export default deserializeUser;
