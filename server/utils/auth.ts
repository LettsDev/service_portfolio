import jwt from "jsonwebtoken";
import "dotenv/config";
const secret = process.env.JWTSECRET;

export function verifyJWT(token: string | undefined) {
  try {
    if (secret) {
      if (token) {
        const decoded = jwt.verify(token, secret);
        return {
          valid: true,
          expired: false,
          decoded,
        };
      }
      throw Error("no token");
    }
    throw Error("missing secret key env variable");
  } catch (e: any) {
    return {
      valid: false,
      expired: true,
      decoded: null,
    };
  }
}

export function signJWT(payload: object, options?: jwt.SignOptions) {
  if (secret) {
    try {
      return jwt.sign(payload, secret, { ...options, algorithm: "HS256" });
    } catch (error) {
      console.error(error);
    }
  }
  console.error("no JWT secret");
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
