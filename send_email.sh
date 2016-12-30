GROUPME_DIR=
LOG_EMAIL=

echo "bunyan $GROUPME_DIR/logs/groupme.log.0 > groupme.log.pretty"
bunyan $GROUPME_DIR/logs/groupme.log.0 > groupme.log.pretty
echo "Groupme Log File" | mail -s "`date`" -A groupme.log.pretty $LOG_EMAIL
rm groupme.log.pretty
