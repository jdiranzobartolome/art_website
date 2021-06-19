const mongoose = require('mongoose');
// This package allows us to create a config file (defaut.js)
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
   // Always wrap in try/catch the mongoose statements
   try {
     await mongoose.connect(db, {
         useNewUrlParser: true,
         useCreateIndex: true,
         useFindAndModify: false
     });
     console.log('MongoDB Connected...');
   }  catch(err) {
       console.error(err.message);
       process.exit(1);
   }
}

module.exports = connectDB;