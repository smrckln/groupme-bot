var api = require('groupme').Stateless;

var botID = process.env.BOT_ID || -1;
var accessToken = process.env.ACCESS_TOKEN || -1;

var logger = require('./log.js');

const PAD_LENGTH = 25;

function _postMessage(message) {
  var botResponse, options, body;

  logger.info('Message sent');
  api.Bots.post(accessToken, botID, message, {picture_url:""}, function(){});

}



module.exports = {
    postMessage: _postMessage
};
