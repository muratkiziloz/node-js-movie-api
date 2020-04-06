const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Models

const Director = require('../models/Director');

// director oluşturma (post) metodu
router.post('/', (req, res, next) => {
  const director = new Director(req.body);
  const promise = director.save();

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err)
  })
});

// tüm yönetmenleri çekme (get işlemi)
router.get('/', (req, res) => {
  const promise = Director.aggregate([
    {
      $lookup: {
        from: 'movies', // collection adı
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies', // dönen datanın atanacağı yer
      }
    },
    {
      $group : {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies: {
          $push: '$movies'
        }
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        movies: '$movies'
      }
    }
  ]);

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err)
  })
});

// id ye göre yönetmen listeleme
router.get('/:director_id', (req, res) => {
  const promise = Director.aggregate([
    {
      $match: {
        '_id': mongoose.Types.ObjectId(req.params.director_id)
      }
    },
    {
      $lookup: {
        from: 'movies', // collection adı
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies', // dönen datanın atanacağı yer
      }
    },
    {
      $group : {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies: {
          $push: '$movies'
        }
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        movies: '$movies'
      }
    }
  ]);

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err)
  })
});

// id ye göre yönetmen güncelleme
router.put('/:director_id', (req, res, next) => {
  const promise = Director.findByIdAndUpdate(
      req.params.director_id,
      req.body,
      {
          new: true
      }
  );

  promise.then((director) => {
      if (!director)
          next({ message: 'Güncelleme işlemi başarısız oldu', code: 99 });
      res.json(director)
  }).catch((err) => {
      res.json(err)
  })
});







module.exports = router;
