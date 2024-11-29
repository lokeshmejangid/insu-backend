const express = require("express");
const authRouter = express.Router();

const authController = require("../controllers/authController");
const validate = require("../middlewares/validateMiddleware");
const {
    signupSchema,
    signinSchema,
    verifyOTPSchema,
    requestPasswordResetSchema,
    resetPasswordSchema,
    verifyResetOTPSchema
} = require("../validators/authValidators");

authRouter.route('/signup').post(validate(signupSchema), authController.signup);
authRouter.route('/verify-otp').post(authController.verifyOTP);
authRouter.route('/signin').post(validate(signinSchema), authController.signin);
authRouter.route('/request-password-reset').post(validate(requestPasswordResetSchema), authController.requestPasswordReset);
authRouter.route('/verify-reset-otp').post(validate(verifyResetOTPSchema), authController.verifyResetOTP);
authRouter.route('/reset-password').post(validate(resetPasswordSchema), authController.resetPassword);
authRouter.route('/get-user/:jwt').get(authController.getUser);
authRouter.route('/get-users').get(authController.getUsers);

module.exports = authRouter;
