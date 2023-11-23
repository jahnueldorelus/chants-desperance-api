import Joi from "joi";

export const reqHeadersSchema = Joi.object({
  "sso-token": Joi.string().min(36).max(36).required(),
});
