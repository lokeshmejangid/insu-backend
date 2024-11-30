const { z } = require("zod");

const policiesListSchema = z.object({
    name: z.string().trim().max(300, "name max 300 characters long"),
    cost: z.number(),
    duration: z.number(),
    category_id: z.string(),
    description: z.string().trim().optional(),
    status: z.boolean()
})

module.exports = { policiesListSchema }