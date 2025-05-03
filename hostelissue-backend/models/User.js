const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  name: String,
  phone: String,
  className: String,
  room: String,
  profileImage: String // optional for direct upload
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
