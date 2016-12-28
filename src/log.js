var bunyan = require('bunyan');

const LOG_PATH = "./logs/groupme.log";

var log = bunyan.createLogger({
    name: 'groupme',
    streams: [{
        type: 'rotating-file',
        path: LOG_PATH,
        period: '1d',   // daily rotation
        count: 5        // keep 3 back copies
    }],
    src: true,

});

module.exports = log;
