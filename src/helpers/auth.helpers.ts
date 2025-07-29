import jwt from "jsonwebtoken";
import { NextFunction } from "express";

export const authHelpers = {
  jwtSign: (any_payload: any) => {
    const payload = {
      nickname: any_payload.nickname,
      email: any_payload.email,
    };

    const accessSecret = process.env.JWT_ACCESS_SECRET;
    if (accessSecret) {
      const accessToken = jwt.sign(payload, accessSecret, {
        expiresIn: "10h",
      });
      return accessToken;
    }
    return false;
  },
  jwtVerify: (
    token: string,
    next: NextFunction
  ): { valid: boolean; payload?: any } => {
    try {
      const secret = process.env.JWT_ACCESS_SECRET;

      if (secret) {
        const payload = jwt.verify(token, secret);
        return { valid: true, payload };
      }
      next({ code: 500, message: "jwt secret not defined" });
      return { valid: false };
    } catch (error) {
      next({ code: 401, message: "token not valid or exprired" });
      return { valid: false };
    }
  },
};
