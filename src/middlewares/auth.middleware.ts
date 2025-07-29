import { Request, Response, NextFunction } from "express";
import { authHelpers } from "../helpers/auth.helpers";

export const authMiddleware = {
  checkIsUserAuthorizedByToken:
    () => async (req: Request, res: Response, next: NextFunction) => {
      try {
        let authHeder = req.headers.authorization;

        if (!authHeder || !authHeder.startsWith("Bearer "))
          return next({ code: 401, message: "token didnt provided" });

        const token = authHeder.split(" ")[1];

        const jwtResult = authHelpers.jwtVerify(token, next);
        if (jwtResult.valid) {
          res.locals.email = jwtResult.payload.email;
          res.locals.nickaname = jwtResult.payload.nickname;
          return next();
        }

        return;
      } catch (error) {
        next(error);
      }
    },
};
