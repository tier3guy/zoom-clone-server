/*

    How does the OTP is gonna work? Get the full explanation here:
                                            ________________________________________________________________________
                                            |                                                                       |
                                            |                                                                       |
    USER -->  { EMAIL @(SignUp Screen) }    |   --> Server will create a new user with that email && puts in th db  |
                                            |                                                                       |
                                            |_______________________________________________________________________|
                                            
                                            FROM THE SERVER SIDE:
                                            ________________________________________________________________________
                                            |                                                                       |   
                                            |                                                                       |   
    Redirect to the OTP Screen     <--      |  now one random otp will be stored in the user.otp == OTP             |
    Once done                               |  and opt is now basically will be sent to the user via the rsgistered |
                                            |  email.                                                               |
                                            |_______________________________________________________________________|

                                            
    FROM THE USER SIDE:
    _____________________________________________________________________________
    Now the user will enter the OTP and in the client side only we will the     |
    check the otp with the one in the db. If it matches then only we will       |
    allow the user to enter the app. Else we will show the user that the OTP    |
    is wrong and ask him to enter the correct OTP.                              |
    ____________________________________________________________________________|
*/

const User = require('../models/users');
const nodemailer = require('nodemailer');


// This function will generate the OTP
function generateOTP() {
    // Declare a string variable
    // which stores all string
    var string = "0123456789";

    // Find the length of string
    var len = string.length;
    var otp = "";

    for (let i = 0; i < 6; i++) {
        otp += string[Math.floor(Math.random() * len)];
    }
    return otp;
}

// Create a new user 
async function createUser(email, password) {

    // const res = await findUserByEmail(email);
    // console.log(res);
    const user = new User({
        email: email,
        password: password,
        otp: generateOTP()
    });
    return user.save();
}

// Find the user by email
async function findUserByEmail (email) {
    try{
        const res = await User.findOne({email: email});
        return res;
    }
    catch(err) {
        return err;
    }
}

// Mailing Function
function sendMail(email, subject, text) {
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: 'avinashgupta.works@outlook.com',
        to: email,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

async function createAccount(fname, lname, email, password) {
    try{
        const user = await User.findOne({email});
        if(user) {
            user.fname = fname;
            user.lname = lname;
            user.password = password;
            const res = await user.save();
            if(res) {
                return {
                    message: 'Account created successfully',
                    status: 'Success',
                    data: null
                }
            }
            else{
                return {
                    message: 'Something went wrong',
                    status: 'Failed',
                    data: null
                }
            }
        } else {
            const newUser = new User({
                fname,
                lname,
                email,
                password
            });
            const res = await newUser.save();
            if(res) {
                return {
                    message: 'Account created successfully',
                    status: 'Success',
                    data: null
                }
            }
        }
    }
    catch(err) {
        return {
            message: 'Something went wrong',
            status: 'Failed',
            data: null
        }
    }
}

module.exports = {
    createUser,
    generateOTP,
    findUserByEmail,
    sendMail,
    createAccount
}