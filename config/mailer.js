const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'akbotazhaksy@gmail.com',
        pass: 'rvtk tnjn qiod asvh',
    },
});

const sendEmail = (to, subject, html) => {
    const mailOptions = {
        from: 'akbotazhaksy@gmail.com',
        to,
        subject,
        html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = sendEmail;
