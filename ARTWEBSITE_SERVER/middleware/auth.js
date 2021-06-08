const config = require('config');
const bcrypt = require('bcryptjs');

module.exports = async function(req, res, next) {
    // When we send a request to a protected route, we will need to send the password on the header
    // Get password from header
   const pwd = req.header('password');

   // Check if not token
   if(!pwd) {
       // The 401 error means "no authorized"
       return res.status(401).json({errors: [{ msg: 'No password, authorization denied.' }]});
   }

   //comparing the entered password with the encrypted password from the config file 
   // @to-do: If I create user database later, I could add users with they hashed passwords there, and even jsonwebtoken authorization. 
   const isMatch = await bcrypt.compare(pwd, config.get('hashedpwd'));
   if (!isMatch) {
       return res.status(400).json({errors: [{ msg: 'Invalid credentials' }]});
   }

   //for testing purposes
   console.log("correct password, sending from middleware to final stage");

   next();
}