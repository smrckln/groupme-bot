#!/bin/bash
source /root/.bashrc

echo "bunyan $GROUPME_DIR/logs/groupme.log.0 > groupme.log.pretty"
`which bunyan` $GROUPME_DIR/logs/groupme.log.0 > groupme.log.pretty
echo "Groupme Log File" | `which mail` -s "`date`" -A groupme.log.pretty $LOG_EMAIL
rm groupme.log.pretty
