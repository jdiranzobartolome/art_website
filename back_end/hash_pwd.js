const bcrypt = require('bcryptjs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
   
  readline.question('Introduce password to hash?', async (pwd) => {
    // Encrypt password and outputting the hash
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(pwd, salt); 
    console.log(`your hashed password is ${password}`);
    readline.close();
  });