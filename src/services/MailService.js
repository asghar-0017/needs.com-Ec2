require('dotenv').config();
const nodemailer = require('nodemailer');
const dotenv=require('dotenv')
dotenv.config()

const Mail = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for port 465, false for port 587
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    }
    });

    const mailUser = {
      from: `${process.env.EMAIL_USER}`, // sender address
      to: data.email, // recipient email
      subject: `${data.subject}`, // email subject
      text: `
        Name: ${data.name}
        Email: ${data.email}
        Message: ${data.message}
      `,
    };
    const mailClient = {
        from: `fa21bscs0017@maju.edu.pk`, // sender address
        to: 'fa21bscs0017@maju.edu.pk', // recipient email
        subject: `${data.subject}`, // email subject
        text: `
          Name: ${data.name}
          Email: ${data.email}
          Message: ${data.message}
        `,
      };

    await transporter.sendMail(mailUser);
    await transporter.sendMail(mailClient);
    return true;
  } catch (err) {
    console.error('Error sending email:', err);
    return false; // or throw an error if needed
  }
};

module.exports = Mail;
