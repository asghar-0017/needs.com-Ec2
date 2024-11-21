require('dotenv').config();
const nodemailer = require('nodemailer');
const dotenv=require('dotenv')
dotenv.config()
require('dotenv').config();

const Mail = async (data) => {
  try {
    // Configure the transporter with Gmail SMTP settings
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'rajaasgharali009@gmail.com',
          pass: 'qofo ycaw fued syct'
      }
  });

    // Email to the user
    const mailUser = {
      from: process.env.SMTP_USER, // sender email
      to: data.email, // recipient email
      subject: data.subject, // subject
      text: `
        Name: ${data.name}
        Email: ${data.email}
        Message: ${data.message}
      `,
    };

    // Email to the admin
    const mailClient = {
      from: process.env.SMTP_USER, // sender email
      to: process.env.ADMIN_EMAIL, // admin email
      subject: `New Message: ${data.subject}`, // subject
      text: `
        Name: ${data.name}
        Email: ${data.email}
        Message: ${data.message}
      `,
    };

    // Send both emails
    await transporter.sendMail(mailUser);
    await transporter.sendMail(mailClient);

    console.log('Emails sent successfully!');
    return true;
  } catch (err) {
    console.error('Error sending email:', err.message);
    return false;
  }
};

module.exports = Mail;
