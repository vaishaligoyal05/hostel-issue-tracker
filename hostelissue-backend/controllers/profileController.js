const Profile = require('../models/Profile');

const uploadProfile = async (req, res) => {
  try {
    const { name, phone, className, roomNumber } = req.body;
    const profilePic = req.file ? req.file.filename : null;

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user.id }, // user ID from auth middleware
      {
        name,
        phone,
        className,
        roomNumber,
        photo: profilePic,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during profile upload' });
  }
};

module.exports = { uploadProfile };
