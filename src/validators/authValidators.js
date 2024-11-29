const { z } = require("zod");

const signupSchema = z.object({
    name: z.string().trim().min(3, "name must be at least 3 characters long").max(100, "name must be max 100 character long"),
    username: z.string().trim().min(3, "Username must be at least 3 characters long").max(100, "Username must be max 100 character long"),
    email: z.string().trim().email("Invalid email address").min(1, "email must be min 1 character long").max(100, "email must be max 100 character long"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must be max 100 character long"),
});

const signinSchema = z.object({
    username: z.string().trim().min(3, "Username must be at least 3 characters long").max(100, "Username must be max 100 character long"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must be max 100 character long"),
});

const verifyOTPSchema = z.object({
    email: z.string().trim().email("Invalid email address").min(1, "email must be min 1 character long").max(100, "email must be max 100 character long"),
    username: z.string().trim().min(3, "Username must be at least 3 characters long").max(100, "Username must be max 100 character long"),
    // otp: z.string().length(6, "OTP must be exactly 6 digits long"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must be max 100 character long"),
    name: z.string().trim().min(3, "name must be at least 3 characters long").max(100, "name must be max 100 character long"),
});

const requestPasswordResetSchema = z.object({
    username: z.string().trim().min(3, "Username must be at least 3 characters long").max(100, "Username must be max 100 character long"),
});

const resetPasswordSchema = z.object({
    username: z.string().trim().min(3, "Username must be at least 3 characters long").max(100, "Username must be max 100 character long"),
    otp: z.string().length(6, "OTP must be exactly 6 digits long"),
    newPassword: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must be max 100 character long"),
});


const verifyResetOTPSchema = z.object({
    username: z.string().trim().min(3, "Username must be at least 3 characters long").max(100, "Username must be max 100 character long"),
    otp: z.string().length(6, "OTP must be exactly 6 digits long"),
});

module.exports = {
    signupSchema,
    signinSchema,
    verifyOTPSchema,
    requestPasswordResetSchema,
    resetPasswordSchema,
    verifyResetOTPSchema,
};
