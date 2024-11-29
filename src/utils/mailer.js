const nodemailer = require('nodemailer');
require('dotenv').config();
const mailText = `#191970`;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendMail = async (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to,
        subject,
        text,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


const sendOTP = async (to, otp) => {
    const subject = 'Your OTP for Registration';
    const text = `Your OTP for registration is: ${otp}`;
    const html = `
    <div
    style="max-width: 600px; margin: 50px auto; background-color: #ffffff; padding: 20px 40px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); text-align: center;">
    <h1 style="color: ${mailText}; margin-bottom: 20px;">Welcome to Our Service!</h1>
    <p style="font-size: 18px; color: #333;">Your OTP for resetting your password is:</p>
    <p style="font-size: 28px; font-weight: bold; color: ${mailText}; margin: 20px 0;">${otp}</p>
    <div style="font-size: 15px; color: #333; margin: 20px 0;">
        <span style="color: #d9534f; font-size: 17px;">Important:</span> This OTP is valid for 5 minutes. Please use it
        before it
        expires. If the OTP expires, you will need to request a new one. If you did not request this, please ignore this
        email.
    </div>
    <p style="font-size: 16px; color: #333; margin-top: 20px;">Thank you!</p>
    <div style="margin-top: 30px; font-size: 12px; color: #999999;">
        &copy; [Your Company's Name]. All rights reserved.
    </div>
    `;
    await sendMail(to, subject, text, html);
};

module.exports = { sendMail, sendOTP };