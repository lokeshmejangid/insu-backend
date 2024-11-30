const { z } = require("zod");

const clientListSchema = z.object({
    image: z.string().trim().max(100, "policiesDoc max 100 characters long").optional(),
    name: z.string().trim().max(300, "name max 300 characters long"),
    status: z.boolean(),
})

module.exports = { clientListSchema }