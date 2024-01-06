import Joi from "@hapi/joi";

const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).trim().required(),

  password: Joi.string().min(6).max(30).trim().required(),
});

export default loginSchema;
