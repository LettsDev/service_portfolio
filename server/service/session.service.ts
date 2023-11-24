import { FilterQuery, UpdateQuery } from "mongoose";
import Session from "../models/sessionModel";
import type { ISession } from "../types";
import { findUser } from "./user.service";
import { verifyJWT, signJWT } from "../utils/auth";
import { get } from "lodash";

export async function createSession(userId: string, userAgent: string) {
  const session = await Session.create({ user: userId, userAgent });
  return session.toJSON();
}

export async function findSessions(query: FilterQuery<ISession>) {
  return Session.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<ISession>,
  update: UpdateQuery<ISession>
) {
  return Session.updateOne(query, update);
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJWT(refreshToken);
  if (!decoded || !get(decoded, "session")) return false;
  const currentSession = await Session.findById(get(decoded, "session"));
  if (!currentSession || !currentSession.valid) return false;
  const user = await findUser({ _id: currentSession.user });
  if (!user) return false;
  const accessToken = signJWT(
    { ...user, session: currentSession._id },
    { expiresIn: "1h" }
  );
  return accessToken;
}
