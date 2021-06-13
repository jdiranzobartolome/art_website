const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult} = require('express-validator/check');

// @todo - authorization when deleting or updating
// Think how to do it without using user. When you try to delete or update
// a pop up message asking for a password should appear. 
// Think how to do that on a save way. (encryptyng the password...etc. )
// I think I can create a middleware that asks for a password

//const auth = require('../../middleware/auth');

const Film = require('../../models/Films');
//const User = require('../../models/User');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// @route    POST api/films/
// @desc     Upload a film
// @access   Private
router.post('/', [auth, [
    check('title', 'Title field is required')
    .not()
    .isEmpty(),
    check('director', 'Director field is required')
    .not()
    .isEmpty(),
    check('country', 'Country field is required')
    .not()
    .isEmpty(),
    check('year', 'Year field is required')
    .not()
    .isEmpty()
    //@todo - validation of the tag
    //Checking that if the tag field is not empty, it need to 
    // be words separated by ; check it with Regex. 
    // Can I use express-validator or I have to do it outside? 
    //@end-todo
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // creating film for uploading
    const newFilm = new Film({
        title: req.body.title,
        processedtitle: (req.body.title).replace(/\s+/g, '').toLowerCase(),
        director: req.body.director,
        country: req.body.country,
        year: req.body.year,
        info: req.body.info,
        trailer: req.body.trailer,
        imglink: req.body.imglink,
    });

    try {
        // See if the film exists, for that we use the title "processedtitle" created only for not allowing the user to 
        // upload movies to the database with same title because of different case or spaces. 
        processedtitle = (req.body.title).replace(/\s+/g, '').toLowerCase();
        let film = await Film.findOne({ processedtitle });
        if(film) {
            return res.status(400).json({errors: [{ msg: 'Movie with same title already in the database' }]});
        }
        // Upload
        const uploaded_film = await newFilm.save();
        res.json(uploaded_film);
    } catch (err) {
        console.error(err.message);
        // handling duplicate key error case (in the case they input a movie already on the database)
        // could be solved like this but I will do it outside since it is cleaner, and I can also trim spaces and 
        // not differentiate between capital and non capital letters on the title, which using only the error of 
        // mongoose because of duplicate unique keys, I cannot. But, I still leave it just in case. 
        if ( err && err.code === 11000 ) {
            return res.status(400).json({errors: [{ msg: 'Movie with same title already in the database' }]});
        }
        res.status(500).send('Server Error');
    }
 
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// @route    PUT api/films/:film_id
// @desc     Update a film
// @access   Private
router.put('/:film_id',[auth, [
    check('title', 'Title field is required')
    .not()
    .isEmpty(),
    check('director', 'Director field is required')
    .not()
    .isEmpty(),
    check('country', 'Country field is required')
    .not()
    .isEmpty(),
    check('year', 'Year field is required')
    .not()
    .isEmpty()
    //@todo - validation of the tag
    //Checking that if the tag field is not empty, it need to 
    // be words separated by ; check it with Regex. 
    // Can I use express-validator or I have to do it outside? 
    //@end-todo
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // We do it like this to update
    const {
        title,
        director,
        country,
        year,
        info,
        tags,
        trailer,
        scenes,
        imglink
    } = req.body;
    
    // Build film object
    // @todo - Make the front end have an edit button next to each film
    // and clicking there all the fields appear and get populated and any field can 
    //be double-click, its content change, and then updated (asking for a password.
    //@todo-end
    const filmFields = {};
    if (title) filmFields.title = title;
    if (director) filmFields.director = director;
    if (country) filmFields.country = country;
    if (year) filmFields.year = year;
    if (info) filmFields.info = info;
    if (tags) {
        // For transforming the string with the tags dot-comma separated to an array (with trimmed spaces)
        filmFields.tags = tags.split(';').map(tag => tag.trim());
    }
    if (trailer) filmFields.trailer = trailer;
    if (scenes) filmFields.scenes = scenes;
    if (imglink) filmFields.imglink = imglink;

    try {
       //Update
       film = await Film.findByIdAndUpdate(
          { _id: req.params.film_id },
          { $set: filmFields},
          {new: true}
       );

       return res.json(film);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// @route    GET api/films
// @desc     Get films and send a subset of six, depending on the number of menu page the client is at, the pages will start founting from 0.
//           It also sends the total number of films that are in the database. 
// @access   Public
router.get('/', async (req, res) => {
    try {
        const number_films = await Film.countDocuments();
        const films_to_skip = req.header('page-number')*6
        console.log(req.header('page-number'));
        films = [];
        if (number_films > 6) {
            films = await Film.find().sort({ date: -1 }).skip(films_to_skip).limit(6);
        } else {
            films = await Film.find().sort({ date: -1 });
        }
        res.json({
            'films': films,
            'total-films': number_films
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/films/:film_id
// @desc     Get film by ID
// @access   Public
router.get('/:film_id', async (req, res) => {
    try {
        const film = await Film.findById(req.params.film_id);
        
        if (!film) {
            return res.status(404).json({ msg: 'Film not found' });
        }

        res.json(film);
    } catch (err) {
        console.error(err.message);
        //In case the user inputs a non-formatted object Id
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Film not found' });
        }
        res.status(500).send('Server Error');
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// @route    DELETE api/films/:film_id
// @desc     Delete a film
// @access   Private
router.delete('/:film_id',auth , async (req, res) => {
    try {
        const film = await Film.findById(req.params.film_id);
        
        if (!film) {
            return res.status(404).json({ msg: 'Film not found' });
        }
        await film.remove();
        res.json({ msg: 'Film removed' });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Film not found' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router; 