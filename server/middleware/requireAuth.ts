import { Response, Request, NextFunction } from "express";
import { verifyAuthority } from "../utils/auth";
import { get } from "lodash";

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;

  if (!user) {
    return res.sendStatus(401);
  }

  return next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;

  if (!user) {
    return res.sendStatus(401);
  }
  const auth = get(user, "auth", "");

  if (!verifyAuthority(3, auth)) {
    return res.sendStatus(403);
  }

  return next();
}
export function requireEnhanced(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = res.locals.user;

  if (!user) {
    return res.sendStatus(401);
  }
  const auth = get(user, "auth", "");

  if (!verifyAuthority(2, auth)) {
    return res.sendStatus(403);
  }

  return next();
}
