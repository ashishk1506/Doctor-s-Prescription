const nodemailer = require('nodemailer')

  let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user:  'aniketkumar@gmail.com', 
                pass:   'Aniket@1234'
            }
        })
        
    let mailOptions = {
            from: 'ashishk8581@gmail.com', 
            to: 'ashishk8581@gmail.com',
            subject: 'Nodemailer - Test',
            text: 'Wooohooo it works!!',
            attachments: [
                { filename: 'text2.pdf', path: 'C:\Users\hi\Downloads\text2.pdf' }
            ]
        }
        
    transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log('Error occurs',err);
            }
             else   console.log('Email sent!!!');
        })
    