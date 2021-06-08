const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult} = require('express-validator/check');

const Musician = require('../../models/Musicians');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// @route    POST api/musicians/
// @desc     Upload a musician
// @access   Private
router.post('/', [auth, [
    check('artist', 'Title field is required')
    .not()
    .isEmpty(),
    check('country', 'Country field is required')
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

    // creating musician for uploading
    const newMusician = new Musician({
        artist: req.body.artist,
        processedartist: (req.body.artist).replace(/\s+/g, '').toLowerCase(),
        country: req.body.country,
        info: req.body.info,
        tags: req.body.tags ? req.body.tags.split(';').map(tag => tag.trim()) : "",
        musicvideos: req.body.musicvideos,
        imglink: req.body.imglink,
    });

    try {
        // See if the film exists, for that we use the artist "processedartist" created only for not allowing the user to 
        // upload movies to the database with same artist because of different case or spaces. 
        processedartist = (req.body.artist).replace(/\s+/g, '').toLowerCase();
        let musician = await Musician.findOne({ processedartist });
        if(musician) {
            return res.status(400).json({errors: [{ msg: 'Musician with same name already in the database' }]});
        }
        // Upload
        const uploaded_musician = await newMusician.save();
        res.json(uploaded_musician);
    } catch (err) {
        console.error(err.message);
        // handling duplicate key error case (in the case they input a movie already on the database)
        // could be solved like this but I will do it outside since it is cleaner, and I can also trim spaces and 
        // not differentiate between capital and non capital letters on the artist, which using only the error of 
        // mongoose because of duplicate unique keys, I cannot. But, I still leave it just in case. 
        if ( err && err.code === 11000 ) {
            return res.status(400).json({errors: [{ msg: 'Musician with same name already in the database' }]});
        }
        res.status(500).send('Server Error');
    }
 
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// @route    PUT api/musicians/:musician_id
// @desc     Update a musician
// @access   Private
router.put('/:musician_id',[auth, [
    check('artist', 'Title field is required')
    .not()
    .isEmpty(),
    check('country', 'Country field is required')
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
        artist,
        country,
        year,
        info,
        tags,
        musicvideos,
        imglink
    } = req.body;
    
    // Build film object
    // @todo - Make the front end have an edit button next to each film
    // and clicking there all the fields appear and get populated and any field can 
    //be double-click, its content change, and then updated (asking for a password.
    //@todo-end
    const musicianFields = {};
    if (artist) musicianFields.artist = artist;
    if (director) musicianFields.author = director;
    if (country) musicianFields.country = country;
    if (year) musicianFields.year = year;
    if (info) musicianFields.info = info;
    if (tags) {
        // For transforming the string with the tags dot-comma separated to an array (with trimmed spaces)
        musicianFields.tags = tags.split(';').map(tag => tag.trim());
    }
    if (scenes) musicianFields.musicvideos = musicvideos;
    if (imglink) musicianFields.imglink = imglink;

    try {
       //Update
       musician = await Musician.findByIdAndUpdate(
          { _id: req.params.musician_id },
          { $set: musicianFields},
          {new: true}
       );

       return res.json(musician);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// @route    GET api/musicians
// @desc     Get all musicians
// @access   Public
router.get('/', async (req, res) => {
    try {
        const musicians = await Musician.find().sort({ date: -1 });
        res.json(musicians);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/musicianss/:musician_id
// @desc     Get musician by ID
// @access   Public
router.get('/:musician_id', async (req, res) => {
    try {
        const musician = await Musician.findById(req.params.musician_id);
        
        if (!musician) {
            return res.status(404).json({ msg: 'Muician not found' });
        }

        res.json(musician);
    } catch (err) {
        console.error(err.message);
        //In case the user inputs a non-formatted object Id
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Musician not found' });
        }
        res.status(500).send('Server Error');
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// @route    DELETE api/musicianss/:musician_id
// @desc     Delete a musician
// @access   Private
router.delete('/:musician_id',auth , async (req, res) => {
    try {
        const musician = await Musician.findById(req.params.musician_id);
        
        if (!musician) {
            return res.status(404).json({ msg: 'Musician not found' });
        }
        await musician.remove();
        res.json({ msg: 'Musician removed' });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Musician not found' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router; 