bunyan logs/groupme.log.0 > groupme.log.pretty
echo "Groupme Log File" | mail -s "`date`" -a "groupme.log.pretty" $LOG_EMAIL
rm groupme.log.pretty
