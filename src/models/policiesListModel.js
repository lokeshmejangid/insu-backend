const mongoose = require('mongoose');

const policiesListSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    category: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        required: true
    },
    policiesDoc: {
        type: String,
        required: true
    }
}, { timestamps: true })


const PoliciesList = mongoose.model("POLICIESLIST", policiesListSchema);

module.exports = PoliciesList;