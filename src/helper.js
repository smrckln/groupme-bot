var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('groupme.db');

var voca = require('voca');

var markov = require('markovchain');

var _ = require('underscore');

var logger = require('./log.js');

const PAD_LENGTH = 25;

function _generateTopWords(name) {
    var user_id = -1;
    var botResponse;



    db.get('select user_id from users where name = ?', [voca.trim(name)], function(err,row){
        user_id = row.user_id;

        botResponse = "";
        var query = 'SELECT word, COUNT(*) count FROM words where user_id = ? Group By word Order By COUNT(*) DESC LIMIT 5';
        db.each(query, [user_id], function(err, row) {
            if (err) {
                logger.error(err);
                return;
            }

            botResponse += voca.pad(row.word, PAD_LENGTH) + voca.pad(row.count + " times", PAD_LENGTH) + "\n";
        }, function(err, numRows){
            if (err) {
                logger.error(err);
                return;
            }
            return botResponse;
        });
    });
}

function addOrUpdateName(user_id, name) {
    db.get('select * from users where user_id = ?', user_id, function(err, row){
        if(!row){
            db.run('insert into users (user_id, name) values (?,?)', [user_id, voca.trim(name)], function(err) {
                if(err){
                    logger.error(err);
                }
            });
        } else {
            if(row.name != voca.trim(name)) {
                db.run('update users set name = ? where user_id = ?', [voca.trim(name), user_id], function(err){
                    if(err) {
                        logger.error(err);
                    }
                });
            }
        }
    });
}

function _updateWords(user_id, name, words) {

    addOrUpdateName(user_id, name);

    var stmt = db.prepare('INSERT INTO words (user_id, word) VALUES (?, ?)');
    for(const word of words){
        stmt.run(user_id, word);
    }
    logger.info('INSERT ' + name + "("+user_id+")");
    stmt.finalize();
}

function _updateMessages(user_id, name, message) {

    addOrUpdateName(user_id, name);

    db.run('insert into messages (user_id, message) values (?, ?)', [user_id, message], function(err){
        if (err) {
            logger.error(err);
        }
    });

    logger.info('INSERT message ' + name + '('+user_id+')');

}

function _generateMessage(user_id, length) {
    db.all('select message from messages where user_id = ?', [user_id], function(err, rows){
        var str = _.pluck(rows, 'message').join(' ');
        var chain = new markov(str);

        var useUpperCase = function(wordList){
            var tmpList = Object.keys(wordList).filter(function(word){
                return word[0] >= 'A' && word[0] <= 'Z';
            });
            return tmpList[~~(Math.random()*tmpList.length)];
        };

        return chain.start(useUpperCase).end(length).process();


    });
}

module.exports = {
    updateDBWithWords: _updateWords,
    updateDBWithMessage: _updateMessages,
    generateTopWords: _generateTopWords,
    mimic: _generateMessage
};
