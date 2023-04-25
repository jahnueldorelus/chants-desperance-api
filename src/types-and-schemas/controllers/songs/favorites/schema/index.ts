import Joi from "joi";

export const favoritesInfoSchema = {
  userId: Joi.string().token().min(24).max(24).required(),
  songId: Joi.string().token().min(24).max(24).required(),
};
