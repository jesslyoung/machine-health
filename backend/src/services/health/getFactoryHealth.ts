import {Request, Response} from "express";
import {getMachineHealth} from "./machineHealth";
import {queryApi} from "../../connection/influxdb";


async function fetchLatestData() {
    // Query for all machines within a specific range
    const query = `
    from(bucket: "machines")
    |> range(start: -1w)
    |> group(columns: ["_measurement"])
    |> last()
  `;

    const machines = {

    };
    for await (const row of queryApi.iterateRows(query)) {
        if (!machines[row.values[8]]) {
            machines[row.values[8]] = [];
        }
        // @ts-ignore
        machines[row.values[8]][row.values[7]] = parseFloat(row.values[5]);
    }
    return machines;
}

export default async function getFactoryHealth(req: Request, res: Response) {

    const latestData = await fetchLatestData();

    const result = getMachineHealth(latestData);
    if (result.error) {
        res.status(400).json(result);
    } else {
        res.json(result);
    }

}