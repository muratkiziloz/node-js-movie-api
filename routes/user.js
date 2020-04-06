const express = require('express');
const router = express.Router();

//Models

const User = require('../models/User');

// get method // tüm kullanıcıları çekmek için find kısmı boş bırakıldığında tüm veriler gelir
router.get('/', (req, res) => {
    const promise = User.find({ });

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err)
    })

});
module.exports = router;
