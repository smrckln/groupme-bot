var express = require('express');

var router = express.Router();

router.use(function(req, res, next) {
    // do logging
    console.log(req.method + " " + req.path + " " + req.ip);
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/')

    .get(function(req, res) {
        res.send('Callback Test');
    })

    .post(function(req, res) {
        console.log(req.body);
    });

module.exports = router;
