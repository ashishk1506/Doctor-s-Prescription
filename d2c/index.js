//const fs = require('fs');
//const sgMail = require('@sendgrid/mail');
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const nodemailer = require('nodemailer');

//step1
const express = require('express');

const app = express();

app.listen(5500,() => {
    console.log("app started on port 5500")
})


document.getElementById("send")
    .addEventListener("click",() => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user:  'aniketkumar@gmail.com', 
                pass:   'Aniket@1234'
            }
        });
        
        //step2
        
        let mailOptions = {
            from: 'aniketkumar1601@gmail.com', 
            to: 'kumarsatandra105@gmail.com',
            subject: 'Nodemailer - Test',
            text: 'Wooohooo it works!!',
            attachments: [
                { filename: 'text2.pdf', path: 'C:\Users\hi\Downloads\text2.pdf' }
            ]
        };
        
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                return log('Error occurs');
            }
            return log('Email sent!!!');
        });
    });
       /* pathToAttachment = 'C:\Users\hi\Downloads\text1.pdf';
        attachment = fs.readFileSync(pathToAttachment).toString("base64");

        const msg = {
        to: 'kumarsatandra105@gmail.com',
        from: 'aniketkumar1601@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        };

        sgMail.send(msg).then(response => console.log('Email is sent'))
        .catch(err => {
        console.log(err);
        });
    });*/