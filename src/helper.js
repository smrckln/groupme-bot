var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('groupme.db');

var voca = require('voca');

var markov = require('markovchain');

var _ = require('underscore');

var Promise = require('promise');

var logger = require('./log.js');

const PAD_LENGTH = 25;

function _generateTopWords(name) {
    var user_id = -1;
    var botResponse;

    return new Promise(function(resolve, reject){
        db.get('select user_id from users where name = ?', [voca.trim(name)], function(err,row){
            user_id = row.user_id;

            botResponse = "\n";
            var query = 'SELECT word, COUNT(*) count FROM words where user_id = ? Group By word Order By COUNT(*) DESC LIMIT 5';
            db.each(query, [user_id], function(err, row) {
                if (err) {
                    logger.error(err);
                    reject(err);
                }

                botResponse += voca.pad(row.word, PAD_LENGTH) + voca.pad(row.count + " times", PAD_LENGTH) + "\n";
            }, function(err, numRows){
                if (err) {
                    logger.error(err);
                    reject(err);
                }
                resolve(botResponse);
            });
        });
    });
}

function addOrUpdateName(user_id, name) {
    return new Promise(function(resolve, reject){
        db.get('select * from users where user_id = ?', user_id, function(err, row){
            if(!row){
                db.run('insert into users (user_id, name) values (?,?)', [user_id, voca.trim(name)], function(err) {
                    if(err){
                        logger.error(err);
                        reject(err);
                    }
                    resolve(null);
                });
            } else {
                if(row.name != voca.trim(name)) {
                    db.run('update users set name = ? where user_id = ?', [voca.trim(name), user_id], function(err){
                        if(err) {
                            logger.error(err);
                            reject(err);
                        }
                        resolve(null);
                    });
                }
            }
        });
    });
}

function _updateWords(user_id, name, words) {

    return new Promise(function(resolve, reject){
        addOrUpdateName(user_id, name).then(function(err){
            if (err){
                logger.error("ERROR _updateWords");
                reject(err);
            }
            var stmt = db.prepare('INSERT INTO words (user_id, word) VALUES (?, ?)');
            for(const word of words){
                stmt.run(user_id, word);
            }
            logger.info('INSERT ' + name + "("+user_id+")");
            stmt.finalize();
            resolve(null);
        });
    });


}

function _updateMessages(user_id, name, message) {

    return new Promise(function(resolve, reject){
        addOrUpdateName(user_id, name).then(function(err){
            if (err){
                logger.error("ERROR _updateMessages");
                reject(err);
            }
            db.run('insert into messages (user_id, message) values (?, ?)', [user_id, message], function(err){
                if (err) {
                    logger.error(err);
                }
            });

            logger.info('INSERT message ' + name + '('+user_id+')');
            resolve(null);
        });
    });



}

function _generateMessage(user_id, length) {
    return new Promise(function(resolve, reject){
        db.all('select message from messages where user_id = ?', [user_id], function(err, rows){
            if (err){
                reject(err);
            }
            if (rows.length < 1){
                reject();
            }
            var str = _.pluck(rows, 'message').join(' ');
            var chain = new markov(str);

            var useUpperCase = function(wordList){
                var tmpList = Object.keys(wordList).filter(function(word){
                    return word[0] >= 'A' && word[0] <= 'Z';
                });
                return tmpList[~~(Math.random()*tmpList.length)];
            };

            resolve(chain.start(useUpperCase).end(length).process());


        });
    });
}

module.exports = {
    updateDBWithWords: _updateWords,
    updateDBWithMessage: _updateMessages,
    generateTopWords: _generateTopWords,
    mimic: _generateMessage
};
