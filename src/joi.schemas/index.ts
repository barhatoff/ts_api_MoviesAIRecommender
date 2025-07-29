import Joi from "joi";

export const joiSchemas = {
  user: Joi.object().keys({
    email: Joi.string().email().required().min(3).max(50),
    password: Joi.string().required().min(8).max(100),
    nickname: Joi.string().min(3).max(50).required(),
  }),
  movie: Joi.object().keys({
    imdb_id: Joi.string().length(9).required(),
  }),
};
