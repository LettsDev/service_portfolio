import { Request, Response } from "express";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJWT } from "../utils/auth";
import "dotenv/config";

const sessionController = (() => {
  async function createUserSession(req: Request, res: Response) {
    //validate
    const user = await validatePassword(req.body);
    //user is JSON object
    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }

    const session = await createSession(
      user._id.toString(),
      req.get("user-agent") || ""
    );
    //session is JSON object

    const accessToken = signJWT(
      { ...user, session: session._id },
      { expiresIn: "1h" }
    );
    const refreshToken = signJWT(
      { ...user, session: session._id },
      { expiresIn: "7d" }
    );
    res.cookie("accessToken", accessToken, {
      maxAge: 36e5, //1 hour
      httpOnly: true,
      domain: process.env.DOMAIN as string,
      path: "/",
      sameSite: "strict",
      secure: process.env.SECURE === "true",
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 36.048e8, //1 week
      httpOnly: true,
      domain: process.env.DOMAIN as string,
      path: "/",
      sameSite: "strict",
      secure: process.env.SECURE === "true",
    });
    res.send({ accessToken, refreshToken });
  }
  async function getUserSession(req: Request, res: Response) {
    const userId = res.locals.user._id;
    const sessions = await findSessions({ user: userId, valid: true });

    return res.send(sessions);
  }
  async function deleteUserSession(req: Request, res: Response) {
    const sessionId = res.locals.user.session;

    await updateSession({ _id: sessionId }, { valid: false });
    res.clearCookie("accessToken");
    return res.send({ accessToken: null, refreshToken: null });
  }
  return { createUserSession, getUserSession, deleteUserSession };
})();
export default sessionController;
