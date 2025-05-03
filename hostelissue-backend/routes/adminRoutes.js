const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User'); 
const verifyToken = require('../middleware/auth');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const unique = `${base}-${Date.now()}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, or PNG allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

/**
 * @route   GET /api/admin/me
 * @desc    Get current admin profile
 * @access  Private
 */
// GET /api/admin/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const profile = await User.findById(req.user.userId).select('name mobile photo role'); 
    if (!profile) return res.status(404).json({ message: 'Admin not found' });
    res.json(profile);
  } catch (err) {
    console.error('Error fetching admin profile:', err);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// PUT /api/admin/profile
router.put('/profile', verifyToken, upload.single('photo'), async (req, res) => {
  const { name, mobile } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const updateData = { name, mobile };
    if (photo) updateData.photo = photo;

    const updated = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateData },
      { new: true }
    );

    res.json({
      message: 'Profile updated successfully',
      admin: updated,
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Profile update failed' });
  }
});


module.exports = router;
