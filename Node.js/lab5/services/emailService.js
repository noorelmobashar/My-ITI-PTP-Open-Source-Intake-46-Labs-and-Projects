const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');

require('dotenv').config();

const sendEmail = async (template, data, to, subject) => {
    
    const service = 'gmail';
    const auth = {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    };

    const transporter = nodemailer.createTransport({
        service,
        auth
    });

    data = await ejs.renderFile(path.join(__dirname, '..', 'views/emails', template), data);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: data
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;