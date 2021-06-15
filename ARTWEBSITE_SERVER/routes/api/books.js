const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult} = require('express-validator/check');

const Book = require('../../models/Books');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// @route    POST api/books/
// @desc     Upload a book
// @access   Private
router.post('/', [auth, [
    check('title', 'Title field is required')
    .not()
    .isEmpty(),
    check('author', 'Author field is required')
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
    const newBook = new Book({
        title: req.body.title,
        processedtitle: (req.body.title).replace(/\s+/g, '').toLowerCase(),
        author: req.body.author,
        country: req.body.country,
        year: req.body.year,
        info: req.body.info,
        quotes: req.body.quotes,
        imglink: req.body.imglink
    });

    try {
        // See if the book exists, for that we use the title "processedtitle" created only for not allowing the user to 
        // upload movies to the database with same title because of different case or spaces. 
        processedtitle = (req.body.title).replace(/\s+/g, '').toLowerCase();
        let book = await Book.findOne({ processedtitle });
        if(book) {
            return res.status(400).json({errors: [{ msg: 'Book with same title already in the database' }]});
        }
        // Upload
        const uploaded_book = await newBook.save();
        res.json(uploaded_book);
    } catch (err) {
        console.error(err.message);
        // handling duplicate key error case (in the case they input a movie already on the database)
        // could be solved like this but I will do it outside since it is cleaner, and I can also trim spaces and 
        // not differentiate between capital and non capital letters on the title, which using only the error of 
        // mongoose because of duplicate unique keys, I cannot. But, I still leave it just in case. 
        if ( err && err.code === 11000 ) {
            return res.status(400).json({errors: [{ msg: 'Book with same title already in the database' }]});
        }
        res.status(500).send('Server Error');
    }
 
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// @route    PUT api/books/:book_id
// @desc     Update a book
// @access   Private
router.put('/:book_id',[auth, [
    check('title', 'Title field is required')
    .not()
    .isEmpty(),
    check('author', 'Director field is required')
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
        author,
        country,
        year,
        info,
        tags,
        quotes,
        imglink
    } = req.body;
    
    // Build film object
    // @todo - Make the front end have an edit button next to each film
    // and clicking there all the fields appear and get populated and any field can 
    //be double-click, its content change, and then updated (asking for a password.
    //@todo-end
    const bookFields = {};
    if (title) bookFields.title = title;
    if (author) bookFields.author = author;
    if (country) bookFields.country = country;
    if (year) bookFields.year = year;
    if (info) bookFields.info = info;
    if (tags) {
        // For transforming the string with the tags dot-comma separated to an array (with trimmed spaces)
        bookFields.tags = tags.split(';').map(tag => tag.trim());
    }
    if (quotes) bookFields.quotes = quotes;
    if (imglink) bookFields.imglink = imglink;

    try {
       //Update
       book = await Book.findByIdAndUpdate(
          { _id: req.params.book_id },
          { $set: bookFields},
          {new: true}
       );

       return res.json(book);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// @route    GET api/books
// @desc     Get books and send a subset of six, depending on the number of menu page the client is at, the pages will start founting from 0.
//           It also sends the total number of books that are in the database. 
// @access   Public
router.get('/', async (req, res) => {
    try {
        const number_books = await Book.countDocuments();
        const books_to_skip = req.header('page-number')*6
        console.log(req.header('page-number'));
        let books = [];
        if (number_books > 6) {
            books = await Book.find().sort({ date: -1 }).skip(books_to_skip).limit(6);
        } else {
            books = await Book.find().sort({ date: -1 });
        }
        res.json({
            'books': books,
            'total-books': number_books
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/bookss/:book_id
// @desc     Get book by ID
// @access   Public
router.get('/:book_id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.book_id);
        
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        res.json(book);
    } catch (err) {
        console.error(err.message);
        //In case the user inputs a non-formatted object Id
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Book not found' });
        }
        res.status(500).send('Server Error');
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// @route    DELETE api/bookss/:book_id
// @desc     Delete a book
// @access   Private
router.delete('/:book_id',auth , async (req, res) => {
    try {
        const book = await Book.findById(req.params.book_id);
        
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }
        await book.remove();
        res.json({ msg: 'Book removed' });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Book not found' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router; 