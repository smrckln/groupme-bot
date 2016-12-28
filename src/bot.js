var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('groupme.db');
var api = require('groupme').Stateless;

var request = require('request');

var botID = process.env.BOT_ID || -1;
var accessToken = process.env.ACCESS_TOKEN || -1;

var logger = require('./log.js');

function _postMessage(name) {
  var botResponse, options, body;

  var user_id = -1;

  db.get('select user_id from users where name = ?', [name], function(err,row){
      user_id = row.user_id;

      botResponse = "";
      var query = 'SELECT word, COUNT(*) count FROM words where user_id = ? Group By word Order By COUNT(*) DESC LIMIT 5';
      db.each(query, [user_id], function(err, row) {
          if (err) {
              logger.error(err);
              return;
          }

          botResponse += row.word + " " + row.count + "\n";
      }, function(err, numRows){
          if (err) {
              logger.error(err);
              return;
          }
          body = {
            "bot_id" : botID,
            "text" : botResponse
          };

          logger.info('Message sent');
          api.Bots.post(accessToken, botID, botResponse, {picture_url:""}, function(){});
      });
  });
}

function _update(user_id, name, words) {
    db.get('select * from users where user_id = ?', user_id, function(err, row){
        if(!row){
            db.run('insert into users (user_id, name) values (?,?)', [user_id, name], function(err) {
                if(err){
                    logger.error(err);
                }
            });
        } else {
            if(row.name != name) {
                db.run('update users set name = ? where user_id = ?', [name, user_id], function(err){
                    if(err) {
                        logger.error(err);
                    }
                });
            }
        }
    });
    var stmt = db.prepare('INSERT INTO words (user_id, word) VALUES (?, ?)');
    for(const word of words){
        logger.info('INSERT ' + user_id + " " + word);
        stmt.run(user_id, word);
    }
    stmt.finalize();
}

module.exports = {
    update: _update,
    postMessage: _postMessage
};
