const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { sendMail, sendOTP } = require("../utils/mailer");

const otpStore = new Map();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const setOTPExpiry = (email) => {
    setTimeout(() => {
        otpStore.delete(email);
    }, 5 * 60 * 1000);
};

const signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const userExist = await User.findOne({ username });
        if (userExist) return res.status(400).json({ message: "Invalid Credentials" });

        otpStore.delete(email);
        const otp = generateOTP();
        otpStore.set(email, otp);
        setOTPExpiry(email);
        await sendOTP(email, otp);

        res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error", errorMessage: error });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { name, username, email, password, otp } = req.body;
        // const userExsit = await User.findOne({ username });
        // if (userExsit) return res.status(400).send({ message: "User Already Exists" });

        // const storedOTP = otpStore.get(email);
        // if (storedOTP !== otp) {
        //     return res.status(400).json({ message: "Invalid OTP" });
        // }
        const createdUser = await User.create({ name, username, email, password });
        // otpStore.delete(email);
        res.status(201).json({ message: "Registration Successful", userId: createdUser._id.toString() });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error", errorMessage: error });
    }
};

const signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userExist = await User.findOne({ username });
        if (!userExist) return res.status(400).json({ message: "username not exist" });

        const user = await bcrypt.compare(password, userExist.password);
        const JWT = await userExist.generateToken();

        if (user) {
            const updatedJWT = await User.findByIdAndUpdate(userExist._id, {
                jwt: JWT
            }, { new: true });

            res.status(200).json({ message: "Login Successful", token: JWT, userId: userExist._id.toString() });

        } else {
            res.status(400).json({ message: "Invalid Login Details" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ mesage: "Internal Server Error", errorMessage: error });
    }
}

const requestPasswordReset = async (req, res) => {
    try {
        const { username } = req.body;

        const userExist = await User.findOne({ username });
        if (!userExist) {
            return res.status(400).json({ message: "User not found" });
        }
        const email = userExist.email;
        otpStore.delete(email);
        const otp = generateOTP();
        otpStore.set(email, otp);
        setOTPExpiry(email);
        await sendOTP(email, otp);
        res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error", errorMessage: error.message });
    }
};


const verifyResetOTP = async (req, res) => {
    try {
        const { username, otp } = req.body;
        const userExist = await User.findOne({ username });
        if (!userExist) {
            return res.status(400).json({ message: "User not found" });
        }
        const email = userExist.email;
        const storedOTP = otpStore.get(email);

        if (storedOTP !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error", errorMessage: error });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { username, otp, newPassword } = req.body;
        const userExist = await User.findOne({ username });
        if (!userExist) {
            return res.status(400).json({ message: "User not found" });
        }
        const email = userExist.email;
        const storedOTP = otpStore.get(email);
        if (storedOTP !== otp) {
            return res.status(400).json({ message: "otp will be used or wrong, please resand otp" });
        }
        otpStore.delete(email);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const update = await User.findOneAndUpdate({ username }, { password: hashedPassword });
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error", errorMessage: error });
    }
};

const getUser = async (req, res) => {
    try {
        const jwt = req.params.jwt;
        const user = await User.findOne({ jwt });
        if (!user) return res.status(400).json({ message: "user not exist" })
        return res.status(200).json({ message: `get registered User: ${user.name}`, user: user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ mesage: "Internal Server Error", errorMessage: error });
    }
}

const getUsers = async (req, res) => {
    try {
        const allUsers = await User.find();
        return res.status(200).json({ message: "get all registered Users", user: allUsers });
    } catch (error) {
        console.error(error);
        res.status(500).send({ mesage: "Internal Server Error", errorMessage: error });
    }
}

module.exports = { signup, verifyOTP, signin, requestPasswordReset, resetPassword, verifyResetOTP, getUser, getUsers };
