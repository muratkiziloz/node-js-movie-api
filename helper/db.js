const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb+srv://muratkiziloz:devmrt2@cluster0-uknbg.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('open', () => {
        console.log('connected')
    });
    mongoose.connection.on('error', (err) => {
        console.log('not conneted', err)
    });

    mongoose.Promise = global.Promise;
}
