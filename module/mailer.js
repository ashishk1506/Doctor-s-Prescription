const nodemailer = require('nodemailer');

const mailer = (url, data ) => {

if(data == undefined || data.pEmail == ""){
    return
}
console.log(data)
//SMTP Credentials
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
    to: data.pEmail,
    subject: 'Doctor Prescription',
    text: `Dear ${data.pName},
    Please find the link for prescription\n
    ${url}\n
    Praying for Good Health\n
    ${data.dName}\n
`,
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