const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, default: null }, // store filename
  mobile: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming Admins are users too
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
