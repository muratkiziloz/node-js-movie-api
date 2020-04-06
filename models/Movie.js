const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    director_id: Schema.Types.ObjectId,
    title: {
        type: String,
        // hata mesajı olarak kendi yazdığımız mesajı gönderme şekli
        required: [true, '`{PATH}` alanı zorunludur.'],
        maxlength: [50, '`{PATH}` alanı (`{VALUE}`), ({MAXLENGTH}) karakterden küçük olmalıdır'],
        minlength: [1, '`{PATH}` alanı (`{VALUE}`), ({MAXLENGTH}) karakterden büyük olmalıdır'],
    },
    category: {
      type: String ,
      maxlength: 30,
      minlength: 2,
    },
    country: {
        type: String ,
        maxlength: 30,
        minlength: 2,
    },
    year: {
        type: Number,
        min: 1900,
        max:2025

    },
    imdb_score: {
        type: Number,
        max: 10,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now

    }

});

module.exports = mongoose.model('movie', MovieSchema);
