const { z } = require("zod");

const insuranceSchema = z.object({
    clientId: z.string().max(300, "name max 300 characters long"),
    vehicleRegNo: z.string().max(300, "name max 300 characters long"),
    insurancePolicyId: z.string().max(300, "name max 300 characters long"),
    registrationDate: z.string().max(300, "name max 300 characters long"),
    expiryDate: z.string().trim().max(300, "name max 300 characters long"),
    vehicleChassisNo: z.string().max(300, "name max 300 characters long"),
    vehicleModal: z.string().max(300, "name max 300 characters long"),
    status: z.boolean()
})

module.exports = { insuranceSchema }