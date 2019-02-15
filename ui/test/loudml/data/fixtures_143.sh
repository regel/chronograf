#!/bin/bash
FILE=`dirname $0`/../data/model_143.json
curl -i -X PUT \
-d '`cat $FILE`' \
http://51.15.255.34:8077/models