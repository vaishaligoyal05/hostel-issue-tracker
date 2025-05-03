const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  className: { type: String, required: true },
  roomNumber: { type: String, required: true },
  profileImage: { type: String }, // only filename or path
});

module.exports = mongoose.model('Student', studentSchema);
