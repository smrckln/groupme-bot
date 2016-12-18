var express = require('express');
var voca = require('voca');

var router = express.Router();

var bot = require('../bot.js');

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
        var botRegex = /^\/top @[A-Z a-z0-9]+$/;

        if(req.body.text && botRegex.test(req.body.text)) {
            res.send('OK');
            bot.postMessage();

        } else {
            res.send('OK');
            var split = voca.words(req.body.text);
            var user_id = req.body.sender_id;
            var name = req.body.name;

            bot.update(user_id, name, split);
        }


    });

module.exports = router;
