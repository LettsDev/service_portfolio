import jwt from "jsonwebtoken";
import "dotenv/config";
const secret = process.env.JWTSECRET;

export function verifyJWT(token: string) {
  try {
    if (secret) {
      const decoded = jwt.verify(token, secret);
      return {
        valid: true,
        expired: false,
        decoded,
      };
    } else {
      throw Error("missing secret key");
    }
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}

export function signJWT(payload: object, options?: jwt.SignOptions) {
  if (secret) {
    return jwt.sign(payload, secret, { ...options, algorithm: "HS256" });
  } else {
    console.log("no secret");
  }
}

export function isVerified(minLevel: number, userAuthLevel: string) {
  const getUserAuthNumber = (userAuthLevel: string) => {
    switch (userAuthLevel) {
      case "ADMIN":
        return 3;
      case "ENHANCED":
        return 2;
      case "USER":
        return 1;
      default:
        return 0;
    }
  };
  if (minLevel > getUserAuthNumber(userAuthLevel)) {
    return false;
  }
  return true;
}
