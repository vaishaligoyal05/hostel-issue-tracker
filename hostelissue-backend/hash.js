  const bcrypt = require('bcrypt');

  async function generateHashedPassword() {
    const password = 'test123'; // 🔁 Replace this with your desired password
    const hash = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hash);
  }

  generateHashedPassword();
