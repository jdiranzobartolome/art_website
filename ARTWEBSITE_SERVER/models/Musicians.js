const mongoose = require('mongoose');

const MusicianSchema = new mongoose.Schema({
    artist: {
        type: String,
        required: true,
        // unique value since we do not want the same movie twice in the database
        // @todo -- regex for comparing titles
        // Add a regex to compare titles so if the input of a movie is quite similar to 
        // one movie on the database, send an alert to the user "we found a movie with a simialr title
        // on the database, you want to still keep on saving this or cancel?"
        unique: true
    },
    processedartist: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String,
        require: true
    },
    info: {
        type: String,
        // We make the info not required
    },
    tags: {
        type: [String],
    },
    musicvideos: {
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

module.exports = Musician = mongoose.model('musician', MusicianSchema);