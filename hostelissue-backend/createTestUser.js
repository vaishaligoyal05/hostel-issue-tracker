const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/hostelissueDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const hashedPassword = await bcrypt.hash('test123', 10);
  
  await User.create({
    username: 'testuser',
    password: hashedPassword
  });

  console.log('Test user created!');
  mongoose.disconnect();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
