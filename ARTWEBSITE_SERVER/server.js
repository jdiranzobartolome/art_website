const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
// This middleware allows express to parse json data
app.use(express.json({extended: false}));

// This Middleware set CORS so cross-origin shared asswets are allowed (needed for websites to access or send assets to websites that are not
// in the same origin. So with this, websites will be able to access the database of this server. It could also be done 
// we a dependency: 
//var cors = require('cors')
//app.use(cors());
// Read more about this in the following links: 
//https://stackoverflow.com/questions/23751914/how-can-i-set-response-header-on-express-js-assets
//https://stackoverflow.com/questions/20035101/why-does-my-javascript-code-receive-a-no-access-control-allow-origin-header-i
//https://developer.mozilla.org/es/docs/Web/HTTP/CORS/Errors/CORSMissingAllowOrigin
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type, password, page-number');
    next();
});

app.get('/', (req, res) => res.send('API running'));

// Define Routes
// @todo 

// I might not need the user since I only have one user, me. 
// I just need to login when trying to delete or updating 
// something

// @ end-todo
//app.use('/api/users', require('./routes/api/users'));
//app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/films', require('./routes/api/films'));
app.use('/api/books', require('./routes/api/books')); 
app.use('/api/musicians', require('./routes/api/musicians'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {console.log(
    `Server started on port ${PORT}`)
});