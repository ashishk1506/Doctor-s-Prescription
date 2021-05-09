const nodemailer = require('nodemailer');
var counter = function(data) {
    console.log("counter function from app")
    
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:  'ashishk8581@gmail.com', 
        pass: 'gteagdjwempfuhyb'
    }
});

let mailOptions = {
    from: 'ashishk8581@gmail.com',
    to: 'ashishk8581@gmail.com',
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