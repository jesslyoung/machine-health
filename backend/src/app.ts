import 'dotenv/config'
import express, {Request, Response} from 'express';
import {fetchDataRange, getFactoryHealth, saveData} from './services';

const app = express();
const port = 3001;

// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/data', fetchDataRange);
app.post('/data', saveData);
app.get('/machine-health', getFactoryHealth);

app.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}`);
});
