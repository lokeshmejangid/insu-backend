const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGODB_URL;

const CXN = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to MDB");
    } catch (error) {
        console.error(error);
        process.exit(0);
    }
}

module.exports = CXN;
