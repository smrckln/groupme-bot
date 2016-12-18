var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('groupme.db');

var request = require('request');

var botID = '1f597410f6b05ea5a74c5d0928';

function _postMessage(name) {
  var botResponse, options, body;

  var user_id = -1;

  db.get('select user_id from users where name = ?', [name], function(err,row){
      user_id = row.user_id;

      botResponse = "";
      var query = 'SELECT word, COUNT(*) count FROM words where user_id = ? Group By word Order By COUNT(*) DESC LIMIT 5';
      db.each(query, [user_id], function(err, row) {
          console.log(row);
          botResponse += row.word + " " + row.count + "\n";
      }, function(err, numRows){
          console.log(numRows);
          body = {
            "bot_id" : botID,
            "text" : botResponse
          };

          console.log('sending ' + botResponse + ' to ' + botID);

          request.post(
              'http://api.groupme.com/v3/bots/post',
              { json: body },
              function(error, response, body) {
                  if(error) {
                      console.error(error);
                  }
              }
          );
      });
  });
}

function _update(user_id, name, words) {
    db.get('select * from users where user_id = ?', user_id, function(err, row){
        if(!row){
            db.run('insert into users (user_id, name) values (?,?)', [user_id, name], function(err) {
                if(err){
                    console.error(err);
                }
            });
        } else {
            if(row.name != name) {
                db.run('update users set name = ? where user_id = ?', [name, user_id], function(err){
                    if(err) {
                        console.error(err);
                    }
                });
            }
        }
    });
    var stmt = db.prepare('INSERT INTO words (user_id, word) VALUES (?, ?)');
    for(const word of words){
        stmt.run(user_id, word);
    }
    stmt.finalize();
}

module.exports = {
    update: _update,
    postMessage: _postMessage
};
