import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { checkValidityMiddleware } from "../middlewares/validity.middleware";
import { joiSchemas } from "../joi.schemas";

const authRouter = Router();

authRouter.post(
  "/register",
  checkValidityMiddleware(joiSchemas.user),
  authController.register
);
authRouter.post("/login", authController.login);

export { authRouter };
