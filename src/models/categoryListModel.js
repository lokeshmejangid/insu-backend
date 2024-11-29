const mongoose = require('mongoose');

const categoryListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })


const CategoryList = mongoose.model("CATEGORYLIST", categoryListSchema);

module.exports = CategoryList;