const nodemailer = require('nodemailer');

const mailer = (url, email) => {
//SMTP Credentials
console.log("sent mail")
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_MAIL, 
        pass: process.env.MAIL_PASS
    }
});

//Mail Body
const mailOptions = {
    from: process.env.ADMIN_MAIL,
    to: email,
    subject: 'Nodemailer - Test',
    text: url,
};

//Sending Mail
transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
        console.log(err);
        console.log('Cannot send Mail')
    }
    else
    console.log('Email sent!!!', email)
})
}

module.exports = mailer