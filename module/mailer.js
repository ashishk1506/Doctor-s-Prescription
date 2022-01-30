const nodemailer = require('nodemailer');

const counter = function(data) {
    console.log("counter function from app")
    
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_MAIL, 
        pass: process.env.MAIL_PASS
    }
});

let mailOptions = {
    from: process.env.ADMIN_MAIL,
    to: process.env.ADMIN_MAIL,
    subject: 'Nodemailer - Test',
    text: data,
    // attachments: [
    //     { filename: '2019UGEE092(1).pdf', path: '../../Downloads/2019UGEE092(1).pdf' }
    // ]
};

transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
        console.log(err);
        console.log('Error occurs')
    }
    else
    console.log('Email sent!!!')
})
}
module.exports = counter