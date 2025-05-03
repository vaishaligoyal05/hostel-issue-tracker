// scripts/registerUsers.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// 🛜 Your MongoDB connection URI (adjust if needed)
const MONGO_URI = "mongodb://127.0.0.1:27017/hostelissueDB"; 

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB Connected ");
  } catch (error) {
    console.error("MongoDB Connection Error :", error);
    process.exit(1);
  }
}

async function generateUsers() {
  const password = "test123"; // Common password for all
  const hashedPassword = await bcrypt.hash(password, 10);

  const users = [];

  // 10 students
  for (let i = 1; i <= 10; i++) {
    users.push({
      username: `student${i}`,
      password: hashedPassword,
      role: 'student',
      name: `Student ${i}`,
    });
  }

  // 2 admins
  for (let i = 1; i <= 2; i++) {
    users.push({
      username: `admin${i}`,
      password: hashedPassword,
      role: 'admin',
      name: `Admin ${i}`,
    });
  }

  try {
    await User.deleteMany({}); 
    console.log("🧹 Cleared existing users");
    
    await User.insertMany(users);
    console.log("10 students and 2 admins registered successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error registering users:", error);
    process.exit(1);
  }
}

async function start() {
  await connectDB();
  await generateUsers();
}

start();
