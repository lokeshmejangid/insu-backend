const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGODB_URL;

const CXN = async () => {
    try {
        await mongoose.connect('mongodb+srv://lokeshjangidme:fcWixIC6ZHJqPttR@cluster0.30doy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log("Connected to dsfsfMDB");
    } catch (error) {
        console.error(error);
        process.exit(0);
    }
}

module.exports = CXN;
