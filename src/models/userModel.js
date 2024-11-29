const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    jwt: {
        type: String,
        required: false
    }
}, { timestamps: true });


//bcrypt password
userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) next();
    try {
        const soltRound = 10;
        const hashPassword = await bcrypt.hash(user.password, soltRound);
        user.password = hashPassword
    } catch (error) {
        next(error);
    }
});

//jwt token
userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email
            },
            process.env.JWT_KEY,
            {
                expiresIn: "10d"
            }
        )
    } catch (error) {
        console.error(error);
    }
}




const User = mongoose.model("USER", userSchema);
module.exports = User;