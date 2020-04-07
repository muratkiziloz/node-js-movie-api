const express = require('express');
const router = express.Router();
const cors = require('cors');

//Models

const Movie = require('../models/Movie');
app.use(cors({origin: 'http://127.0.0.1:8081'}));
// get method // tüm filmleri çekmek için find kısmı boş bırakıldığında tüm veriler gelir
router.get('/', (req, res) => {
    const promise = Movie.aggregate([
        {
            $lookup: {
                from: 'directors',
                localField: 'director_id',
                foreignField: '_id',
                as: 'director'
            }
        },
        {
            $unwind: '$director'
        }
    ]);

    promise.then((data) => {
        res.json(data)
    }).catch((err) => {
        res.json(err)
    })
});

// en iyi 10 filmi çekme
router.get('/top10', (req, res) => {
    const promise = Movie.find({ }).limit(10).sort({ imdb_score: -1 });

    promise.then((data) => {
        res.json(data)
    }).catch((err) => {
        res.json(err)
    })
});

// id ye göre movie çekme
router.get('/:movie_id', (req, res, next) => {
    const promise = Movie.findById(req.params.movie_id);

    promise.then((movie) => {
        if (!movie)
            next({ message: 'Böyle bir kayıt bulunamadı', code: 99 });
        res.json(movie)
    }).catch((err) => {
        res.json(err)
    })
});


// id ye göre movie güncelleme
router.put('/:movie_id', (req, res, next) => {
    const promise = Movie.findByIdAndUpdate(
        req.params.movie_id,
        req.body,
        {
            new: true
        }
    );

    promise.then((movie) => {
        if (!movie)
            next({ message: 'Güncelleme işlemi başarısız oldu', code: 99 });
        res.json(movie)
    }).catch((err) => {
        res.json(err)
    })
});


// id ye göre movie silme işlemi
router.delete('/:movie_id', (req, res, next) => {
    const promise = Movie.findByIdAndRemove(
        req.params.movie_id,
        req.body
    );

    promise.then((movie) => {
        if (!movie)
            next({ message: 'Böyle bir kayıt bulunamadı', code: 99 });

        res.json({ status: 1 })
    }).catch((err) => {
        res.json(err)
    })
});




// post method movie ekleme
router.post('/', (req, res, next) => {
    //  const { title, imdb_score, category, country, year } = req.body;

    const movie = new Movie(req.body);

    // const movie = new Movie({
    //   title: title,
    //   imdb_score: imdb_score,
    //   category: category,
    //   country: country,
    //   year: year
    // });


// bu da bir seçenek !!
    // movie.save((err, data) => {
    //   if (err)
    //      res.json(err);
    //   res.json(data)
    // });

    // bu daha temiz bir kod oluyor aynı işlem için !!
    const promise = movie.save();
    promise.then((data) => {
        res.json(data)
    }).catch((err) => {
        res.json(err)
    })
// bu daha temiz bir kod oluyor aynı işlem için !!

});


// Between

router.get('/between/:start_year/:end_year', (req, res) => {
    const { start_year, end_year } = req.params;
    const promise = Movie.find(
        {
            year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year)  }
        }
        ).sort({ year: -1 });

    promise.then((data) => {
        res.json(data)
    }).catch((err) => {
        res.json(err)
    })
});

module.exports = router;
