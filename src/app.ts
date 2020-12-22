import cheerio from 'cheerio';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import fetch from 'node-fetch';
import redis from 'redis';
import { dataParser } from './data-parser';
import { IData } from './types';

const { config } = dotenv;
config();

// Initialize express.
const app = express();
const { urlencoded, json } = express;

// Initialize redis client.
const client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');

// initialize cors
const useCors = cors();
app.options('*', useCors);

// Use middlewares.
app.use(cors({ credentials: true, origin: true }));
app.use(morgan('dev'));
app.use(urlencoded({ extended: true }));
app.use(json());

// Initialize server listening.
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

// Main method.
const scrapeData: () => Promise<IData> = async () => {
  const generalUrl = 'https://onemocneni-aktualne.mzcr.cz/covid-19';
  const html = await fetch(generalUrl).then((x) => x.text());
  const $ = cheerio.load(html);

  return dataParser($, generalUrl);
};

// Server route.
app.get('/data', async (_req, res) => {
  client.get('data', async (_err, result) => {
    try {
      let data;

      if (result) {
        data = result;
      } else {
        data = await scrapeData();
        client.setex('data', 300, JSON.stringify(data));
      }
      res.send(data);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
});
