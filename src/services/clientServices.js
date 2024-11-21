const jwt = require("jsonwebtoken"); // Use the correct package
const nodemailer = require('nodemailer');
const dotenv=require('dotenv')
dotenv.config()
const generateToken = (userId) => {
    return jwt.sign({ email: userId }, "yehlay", { expiresIn: '1h' });
};


const sendEmail =async (usermail,code)=>{
    const resetUrl = `http://localhost:3000/reset-password?email=${encodeURIComponent(usermail)}`;
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const htmlContent = `
    <div style="font-family: Arial, sans-serif;">
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
        <p>If you didn’t request this password reset, you can safely ignore this email.</p>
    </div>
    `;

    try {
        await transporter.sendMail({
            from: 'yehlay@gmail.com',
            to: usermail,
            subject: 'Password Reset Request',
            html: htmlContent,
        });

        console.log('Reset email sent to:', usermail);
    } catch (error) {
        console.error("Error sending email:", error);
    }

          
  
  };
module.exports = { generateToken,sendEmail };
