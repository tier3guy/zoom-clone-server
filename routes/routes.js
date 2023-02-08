const route = require('express').Router();

// Import the functions from the main.js file
const { createUser, findUserByEmail, generateOTP, sendMail } = require('../db/functions/main');

route.get('/', (req, res) => {
        res.status(200).json({
            message: 'Welcome to the API',
            status: 'Running',
            data: process.env.MAIL_ID

        });
        res.end();
    }
);

route.post('/api/getOTP', (req, res) => {

    const { email } = req.body;
    if (!email) {
        res.status(400).json({
            message: 'Email is required',
            status: 'Failed',
            data: null
        });
        res.end();
    } else {
        // Check if the email is already registered
        findUserByEmail(email).then(async (user) => {
            if(user){
                user.otp = generateOTP();
                const response = await user.save();
                if(response) {
                    sendMail(email, 'OTP', `Your OTP is ${user.otp}`);
                    res.status(200).json({
                        message: 'OTP sent to your email',
                        status: 'Success',
                        data: user.otp
                    });
                    res.end();
                }
            } else {
                createUser(email, '')
                .then((user) => {
                    sendMail(email, 'OTP', `Your OTP is ${user.otp}`);
                    res.status(200).json({
                        message: 'OTP sent to your email',
                        status: 'Success',
                        data: res.otp
                    });
                    res.end();
                })
                .catch((err) => {
                    res.status(500).json({
                        message: 'Internal Server Error',
                        status: 'Failed',
                        data: null
                    });
                    res.end();
                });
            }
        });
    }
});

module.exports = route;