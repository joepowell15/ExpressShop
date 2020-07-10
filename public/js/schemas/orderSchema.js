const Joi = require("@hapi/joi");

const orderSchema = Joi.object({
  "Customer Name": Joi.string().min(3).max(50).required(),
  "Order Quantity": Joi.number().min(.01).max(10000).required(),
  "Unit Price": Joi.number().min(.01).max(10000).required(),
  "Product Category": Joi.string().min(1).max(100).required(),
}).unknown();

module.exports = orderSchema;
