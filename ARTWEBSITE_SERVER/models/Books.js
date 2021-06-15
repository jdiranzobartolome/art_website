const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        // unique value since we do not want the same movie twice in the database
        // @todo -- regex for comparing titles
        // Add a regex to compare titles so if the input of a movie is quite similar to 
        // one movie on the database, send an alert to the user "we found a movie with a simialr title
        // on the database, you want to still keep on saving this or cancel?"
        unique: true
    },
    processedtitle: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        require: true,
    },
    country: {
        type: String,
        require: true
    },
    year: {
        type: String,
        require: true
    },
    info: {
        type: String,
        // We make the info not required
    },
    quotes: {
        type: [String],
    }, 
    imglink: {
        type: String,
        // We make the img not required (as it might not be available online)
    },
    dateupload: {
        type: Date,
        default: Date.now
    }
});

module.exports = Book = mongoose.model('book', BookSchema);