import {Request, Response} from "express";
import {Point} from "@influxdata/influxdb-client";
import {writeApi} from "../../connection/influxdb";

function saveData(req: Request, res: Response) {
    console.log(JSON.stringify(req.body));

    const point = new Point(req.body.measurement)
        .floatField('value', req.body.value)
        .timestamp(req.body.timestamp); // Optional timestamp

    try {
        writeApi.writePoint(point);
    } catch (e) {
        console.error('Error executing query:', e);
    }
}

export default saveData;