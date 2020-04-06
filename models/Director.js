const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DirectorSchema = new Schema({

    name: {
        type: String,
        maxlength: 50,
        minlength:2
    },
    surname: {
        type: String,
        maxlength: 50,
        minlength: 2
    },
    bio: {
        type: String,
        maxlength: 2000,
        minlength: 60
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('director', DirectorSchema);
