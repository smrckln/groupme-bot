var express = require('express');
var voca = require('voca');

var router = express.Router();

var bot = require('../bot.js');
var logger = require('../log.js');

var helper = require('../helper.js');

router.use(function(req, res, next) {
    // do logging
    logger.info(req.method + " " + req.path + " " + req.ip);
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/')

    .get(function(req, res) {
        res.send('Callback Test\n');
    })

    .post(function(req, res) {
        var botName = process.env.BOT_NAME || "";
        var botRegex = /^!top @[A-Z a-z0-9]+$/;
        var mimicRegex = /^!mimic @[A-z a-z0-9]+$/;
        var user_id = -1;

        if(botRegex.test(req.body.text)) {
            logger.info("TOP SENT");
            res.send('OK');
            var about = req.body.text.substring(req.body.text.indexOf('@')+1);
            helper.generateTopWords(about).then(function(message){
                bot.postMessage(message);
            });


        } else if (mimicRegex.test(req.body.text)){
            logger.info("MIMIC SENT");
            res.send('OK');
            user_id = req.body.sender_id;
            var numRegEx = /d+/;
            var length = numRegEx.exec(req.body.text)[0] || 5;
            helper.mimic(user_id, length).then(function(response){
                bot.postMessage(response);
            });

        } else if (req.body.name != botName) {
            res.send('OK');
            var split = voca.words(req.body.text);
            user_id = req.body.sender_id;
            var name = req.body.name;

            helper.updateDBWithWords(user_id, name, split);
            helper.updateDBWithMessage(user_id, name, req.body.text);
        }


    });

module.exports = router;
