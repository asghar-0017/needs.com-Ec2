const nodemailer = require('nodemailer');
require('dotenv').config();
const path = require('path');
const orderId=require('./generateOrderId')

const billingDetailMail = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'rajaasgharali009@gmail.com',
        pass: 'qofo ycaw fued syct',
    }
    });

    const productsInfo = data.products.map(product =>
      `<tr>

        <td><img src="${product.Imageurl}" alt="${product.title}" style="width: 50px; height: auto;"/></td>
        <td>${product.name}</td>
        <td style="text-align:center;">${product.quantity}</td>
        <td style="text-align:right;">${(product.price).toFixed(2)}</td>
      </tr>`).join('');

    const totalPrice = data.products.reduce((total, product) => total + (product.quantity * product.price), 0);

    const mailOptions = {
      from: `"Needs and Luxuries" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: `Order Confirmation - ${data.firstName} ${data.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <!-- Header -->
          <div style="background-color: #FF5733; padding: 20px; text-align: center;">
            <h1 style="color: white;">Needs and Luxuries</h1>
    <div style="background-color: white; padding: 25px; border-radius: 100px; display: inline-block;">
  <img src="cid:shopIcon" alt="Shop Icon" style="width: 50px; height: auto" />
</div>
            <p style="color: white;">Good news, ${data.firstName}! Your shipment is on its way.</p>
            <h2 style="color: white;">Your Order ID: ${orderId()}.</h2>
          </div>

          <!-- Shipping Address -->
          <div style="padding: 20px;">
            <h2>Shipping Address</h2>
            <p>${data.firstName} ${data.lastName}</p>
            <p>${data.address}</p>
          </div>

          <!-- Order Summary -->
          <h3 style="color: black; border-bottom: 1px solid #ddd;">Order Summary:</h3>
        <table width="100%" cellpadding="10" cellspacing="0" border="0" style="margin-top: 20px;">
            <thead>
              <tr>
          <th style="text-align: left; color: black;">Product Image</th>
          <th style="text-align: left; color: black;">Product</th>
          <th style="text-align: center; color: black;">Quantity</th>
          <th style="text-align: right; color: black;">Price</th>
        </tr>
            </thead>
            <tbody>
              ${productsInfo}
               <tr>
          <td colspan="3" style="text-align: right; padding-top: 10px; border-top: 1px solid #ddd; color: black;"><strong>Total:</strong></td>
          <td style="text-align: right; padding-top: 10px; border-top: 1px solid #ddd; color: black;"><strong>Rs ${totalPrice.toFixed(2)}</strong></td>
        </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div style="background-color: #FF5733; padding: 20px; text-align: center;">
          <p style="color: white;">It may take up to 24 hours for tracking information to update.</p>
          <p style="color: white;">Refer friends and earn rewards - Give Rs50, Get Rs50!</p>
          <a href="#" style="color: white; font-weight: bold;">Learn More</a>
        </div>
      `,
      attachments: [
        {
          filename: 'shopIcon.png',
          path: path.join(__dirname, 'images', 'shop.png'),
          cid: 'shopIcon',
        }
      ],
    };

    const mailClient = {
      from: `"Needs and Luxuries" <${process.env.SMTP_USER}>`,
      to: 'rajaasgharali009@gmail.com', 
      subject: `New Order from ${data.firstName} ${data.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h1>New Order Notification</h1>
          <p>Customer: ${data.firstName} ${data.lastName}</p>
          <p>Email: ${data.email}</p>
          <p>Address: ${data.address}</p>
          <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr style="background-color: #F4F4F4;">
                <th>Product Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${productsInfo}
              <tr>
                <td colspan="3" style="text-align:right;"><strong>Total:</strong></td>
                <td><strong>Rs ${totalPrice.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
    };

    // Send emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailClient);

    return true;
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
};

module.exports = billingDetailMail;
