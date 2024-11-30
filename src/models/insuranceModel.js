const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
    refCode: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    vehicleRegNo: {
        type: String,
        required: true
    },
    insurancePolicyId: {
        type: String,
        required: true
    },
    registrationDate: {
        type: String,
        required: true
    },
    expiryDate: {
        type: String,
        required: false
    },
    vehicleChassisNo: {
        type: String,
        required: true
    },
    vehicleModal: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })


const Insurance = mongoose.model("INSURANCE", insuranceSchema);

module.exports = Insurance;