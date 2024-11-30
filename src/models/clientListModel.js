const mongoose = require('mongoose');

const clientListSchema = new mongoose.Schema({
    image: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })


const ClientList = mongoose.model("CLIENTLIST", clientListSchema);

module.exports = ClientList;