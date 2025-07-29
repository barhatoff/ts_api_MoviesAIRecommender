import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { mainController } from "../controllers/main.controller";

const mainRouter = Router();

mainRouter.get(
  "/users",
  authMiddleware.checkIsUserAuthorizedByToken(),
  mainController.getUsers
);
mainRouter.get(
  "/watchlist",
  authMiddleware.checkIsUserAuthorizedByToken(),
  mainController.getMoviesFromWatchedlist
);
mainRouter.post(
  "/watchlist",
  authMiddleware.checkIsUserAuthorizedByToken(),
  mainController.addMoviesToWatchedlist
);
mainRouter.get(
  "/movies",
  authMiddleware.checkIsUserAuthorizedByToken(),
  mainController.getAllMoviesFromLocalDb
);
mainRouter.get(
  "/movies/recomendations",
  authMiddleware.checkIsUserAuthorizedByToken(),
  mainController.getRecomendation
);

export { mainRouter };
