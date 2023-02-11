const route = require('express').Router();

// Import the functions from the main.js file
const { createUser, findUserByEmail, generateOTP, sendMail, createAccount, verifyUser } = require('../db/functions/main');

route.get('/', (req, res) => {
        res.status(200).json({
            message: 'Welcome to the API',
            status: 'Running',
            data: null

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

route.post('/api/createAccount', (req, res) => {
    const { fname, lname, email, password } = req.body;
    if(!fname || !lname || !email || !password) {
        res.status(400).json({
            message: 'All fields are required',
            status: 'Failed',
            data: null
        });
        res.end();
    } else {
        createAccount(fname, lname, email, password)
        .then((response) => {
            res.status(200).json({
                message: response.message,
                status: response.status,
                data: null
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

route.post('/api/verifyUser', (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        res.status(400).json({
            message: 'All fields are required',
            status: 'Failed',
            data: null
        });
        res.end();
    }
    else{
        verifyUser(email, password)
        .then((response) => {
            res.status(200).json({
                message: response.message,
                status: response.status,
                data: null
            });
            res.end();
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Internal Server Error',
                error: err,
                status: 'Failed',
                data: null
            });
            res.end();
        });
    }
});

module.exports = route;