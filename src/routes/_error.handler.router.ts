import { Request, Response, NextFunction } from "express";

export const errorHandlerRouter = {
  _notFoundHandler: (req: Request, res: Response, next: NextFunction) => {
    next({ code: 404, message: "Route is not found" });
  },
  _handleErrors: (
    err: { code?: number; message?: string },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.status(err.code ?? 500).json({ message: err.message });
  },
};
