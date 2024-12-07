const fs = require("fs")
const validate = (schema) => async (req, res, next) => {
    try {
      console.log("Request body before validation:", req.body); // Log incoming request
      const parsedData = await schema.parseAsync(req.body); // Validate using Zod
      req.body = parsedData; // Replace with validated data
      next(); // Proceed to next middleware/controller
    } catch (err) {
      console.error("Validation error:", err);
      const errors = err.errors || [];
      res.status(400).json({
        status: 400,
        message: "Validation Failed",
        errors: errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
  };
  
  module.exports = validate;
