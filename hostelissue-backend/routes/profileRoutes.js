const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/User');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

// PUT /api/profile
router.put('/', verifyToken, upload.single('profilePic'), async (req, res) => {
  try {
    const userId = req.user.userId;

    const updateData = {
      name: req.body.name,
      phone: req.body.phone,
      className: req.body.className,
      room: req.body.room,
    };

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).lean();
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
