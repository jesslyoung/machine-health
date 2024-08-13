const data = require('../../native-app/data/machineData');
const fs = require('fs')

const month = '2024-08';
const shifts = ['T07:00:00', 'T015:00:00', 'T23:00:00'];

function getSampleValue(attr) {
  let min = 0;
  let max = 0;

  let r = Math.random();
  if (r > .9) {
    min = attr.optimalRange[0];
    max = attr.optimalRange[1];
  } else if (r < 0.2) {
    min = attr.abnormalRange[0];
    max = attr.abnormalRange[1];
  } else {
    min = attr.normalRange[0];
    max = attr.normalRange[1];
  }
  return Math.random() * (max - min) + min;
}

function getTimestamp (month, day, shift) {
  const dayStr = String(day).padStart(2, '0');
  const date = new Date(`${month}-${dayStr}${shifts[shifts.length - 1]}`);
  return date.getTime() * 1000000;
}

const writer = fs.createWriteStream('sample-data.txt', { flags: 'a' })

for (let section of Object.keys(data)) {
  for (let attribute of Object.keys(data[section])) {
    if (attribute === 'name') continue;
    for (let i = 1; i <= 31; i++) {
      for (let shift in shifts) {
        const sampleValue = getSampleValue(data[section][attribute]);
        const timestamp = getTimestamp(month, i, shift);
        writer.write(`\n${attribute},machine=${section} value="${sampleValue}" ${timestamp}`)
      }
    }
  }
}

writer.end();
