const { z } = require("zod");

const clientListSchema = z.object({
    name: z.string().trim().max(300, "Name must be at most 300 characters long"),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    policy_id: z.string().nonempty("Policy ID is required"),
    status: z.boolean(),
  });


module.exports = { clientListSchema }