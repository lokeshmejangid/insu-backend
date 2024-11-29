const { z } = require("zod");

const policiesListSchema = z.object({
    name: z.string().trim().max(300, "name max 300 characters long"),
    cost: z.number(),
    duration: z.string().trim().max(100, "duration max 100 characters long"),
    category: z.number(),
    desc: z.string().trim().optional(),
    status: z.boolean(),
    policiesDoc: z.string().trim().max(100, "policiesDoc max 100 characters long")
})

module.exports = { policiesListSchema }