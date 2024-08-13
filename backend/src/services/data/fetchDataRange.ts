import {Request, Response} from "express";
import { queryApi, writeApi } from '../../connection/influxdb';
import redisClient from '../../connection/redis';
import {generateChecksum, generateCacheKey, getSundayOfWeek} from './util/cache';

// async function validateChecksumWeeks(checksums) {
//
//     const sundayDataToFetch: any[] = [];
//     const results = [];
//     const invalidChecksums: any[] = [];
//
//     // Check each checksum
//     for (const { sundayDate, checksum } of checksums) {
//         const cacheKey = generateCacheKey(new Date(sundayDate));
//         const cachedChecksum = await redisClient.get(cacheKey);
//
//         if (cachedChecksum === checksum) {
//             // Cache is valid, skip fetching data
//             results.push({ sundayDate, data: 'Cache hit' });
//         } else {
//             // Cache is invalid or missing, add to fetch list
//             sundayDataToFetch.push({ sundayDate, cacheKey });
//             invalidChecksums.push({ sundayDate });
//         }
//     }
//     return results;
// }

async function fetchDataRange(req: Request, res: Response) {
    const { startDate, endDate } = req.query;

    // Validate date range
    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const query = `
    from(bucket: "machines")
    |> range(start: ${startDate}, stop: ${endDate})
    |> group(columns: ["_measurement"])
    |> yield(name: "result")
  `;

    try {
        const result = [];

        for await (const row of queryApi.iterateRows(query)) {
            // @ts-ignore
            result.push({
                measurement: row.values[7],
                machine: row.values[8],
                timestamp: row.values[4],
                value: row.values[5],
            });
            console.log('machine', row.values[8])
        }

        res.json(result);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default fetchDataRange;