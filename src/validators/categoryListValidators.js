const { z } = require("zod");

const categoryListSchema = z.object({
    name: z.string().trim().max(300, "name max 300 characters long"),
    description: z.string().trim().optional(),
    status: z.boolean(),
})

module.exports = { categoryListSchema }