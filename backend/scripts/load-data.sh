#!/bin/bash

export $(grep -v '^#' .env | xargs)

echo "Loading data.."
sleep 2

# Define variables
INFLUXDB_URL="http://localhost:8086"
ORG="factory"
BUCKET="machines"
DATA_FILE="./sample-data.txt"

# Check if the data file exists
if [ ! -f "$DATA_FILE" ]; then
  echo "Data file $DATA_FILE does not exist."
  exit 1
fi

#echo 'errorRate,machine=weldingRobot value=14.511090379288415 1722664800000000000' | \
curl -i -XPOST "${INFLUXDB_URL}/api/v2/write?org=${ORG}&bucket=${BUCKET}&precision=ns" \
   -H "Authorization: Token ${INFLUX_TOKEN}" \
   -H "Content-Type: text/plain; charset=utf-8" \
   --data-binary @sample-data.txt

echo "Data import completed."
