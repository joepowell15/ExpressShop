import Joi from "@hapi/joi";

const orderSchema = Joi.object({
  "Customer Name": Joi.string().min(3).max(50).required().messages({
    "string.empty": `"" must contain value`,
    "string.min": `Item Name must be at least 3 characters`,
    "string.max": `Item Name must be at less than 50 characters`,
    "any.required": `Item Name is a required field`
}),
  "Order Quantity": Joi.number().min(.01).max(10000).required(),
  "Unit Price": Joi.number().min(.01).max(10000).required(),
  "Product Category": Joi.string().min(1).max(100).required(),
}).unknown();

export default orderSchema;
