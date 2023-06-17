const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_NAME, // Replace with your Gmail email address
        pass: process.env.MAIL_PASS, // Replace with your Gmail password or an app password for 2-Step Verification
    },
});

// Example function to send an email
exports.sendResetPasswordEmail = async (email, resetLink) => {
    const mailOptions = {
        from: process.env.MAIL_NAME,
        to: email,
        subject: 'Reset Password',
        html: `
      <p>Please click the following link to reset your password:</p>
      <a target="_blank" href="${process.env.PASSWORD_URL}/reset_password/${resetLink}">Reset Password</a>
    `,
    };

    try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        //console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
