const { z } = require("zod");

const policiesListSchema = z.object({
    name: z.string().min(1, "Name is required"),
    cost: z.number().positive("Cost must be a positive number"),
    duration: z.number().positive("Duration must be a positive number"),
    category_id: z.string().min(1, "Category ID is required"),
    description: z.string().optional(),
    status: z.boolean(),
});

module.exports = { policiesListSchema }