const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in the environment variables');
  process.exit(1);
}
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
});

const Auth = require('./model/adminAuth'); 

const initializeAdmin = async () => {
  try {
    const admin = await Auth.findOne({ userName: 'admin' });

    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin', 10);

      const newAdmin = new Auth({
        userName: 'admin',
        password: hashedPassword,
        email: process.env.ADMIN_EMAIL,
        adminId: 786,
      });

      await newAdmin.save();
      console.log('Initial admin user created');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error.message);
  } finally {
    await mongoose.connection.close(); 
    console.log('MongoDB connection closed');
  }
}

initializeAdmin();
