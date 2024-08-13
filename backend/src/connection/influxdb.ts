import { InfluxDB } from '@influxdata/influxdb-client';

const influxDB = new InfluxDB({
    url: 'http://localhost:8086',
    token: process.env.INFLUX_TOKEN
});
const writeApi = influxDB.getWriteApi('factory', 'machines');
const queryApi = influxDB.getQueryApi('factory');

export { queryApi, writeApi };
