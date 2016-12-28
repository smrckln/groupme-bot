
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var routes = require('routes/routes.js');
var logger = require('log.js');

app.use('/api/v1', routes);

app.listen(port);
console.log('App started listening on port ' + port);
logger.info('App started listening on port ' + port);
