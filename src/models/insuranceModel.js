const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
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
        required: true
    },
    vehicleChassisNo: {
        type: String,
        required: true
    },
    vehicleModal: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    document: {
        type: String,
        required: false
    }
}, { timestamps: true })


const Insurance = mongoose.model("INSURANCE", insuranceSchema);

module.exports = Insurance;