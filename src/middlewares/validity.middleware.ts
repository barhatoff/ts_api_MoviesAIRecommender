import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const checkValidityMiddleware = (validationTarger: Joi.ObjectSchema) => {
  const joi = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = validationTarger.validate(req.body);
      if (error) return next({ code: 400, message: error.details[0].message });
      next();
    } catch (error) {
      console.warn(error);
      next(error);
    }
  };
  return joi;
};
