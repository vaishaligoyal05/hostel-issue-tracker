const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register a new user (student or admin)
const register = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Username already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully!',
    });

  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// Login an existing user
const login = async (req, res) => {
  const { username, password } = req.body;

  console.log("Login attempt with:", username, password);

  if (!username || !password) {
    console.log("Username or password missing");
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ username });
    console.log("User found from DB:", user);

    if (!user) {
      console.log("No user found");
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    console.log("Checking password match");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    console.log("JWT_SECRET:", process.env.JWT_SECRET);  
    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET is missing!");
      return res.status(500).json({ success: false, message: 'Server error: Missing JWT_SECRET' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log("Token created successfully!");

    return res.status(200).json({
      success: true,
      message: `Logged in successfully as ${username}`,
      token,
      role: user.role,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};


module.exports = { register, login };
