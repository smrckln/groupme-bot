#!/bin/bash
LOG_EMAIL=
`which bunyan` /root/groupme/logs/groupme.log.0 > groupme.log.pretty
echo "Groupme Log File" | `which mail` -s "`date`" -A groupme.log.pretty $LOG_EMAIL
rm groupme.log.pretty
