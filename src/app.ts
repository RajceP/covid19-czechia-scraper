import cheerio from 'cheerio';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import fetch from 'node-fetch';
import redis from 'redis';

import { dataParser } from './data-parser';

// Set environment variables from .env file.
const { config } = dotenv;
config();

// Initialize express.
const app = express();
const { urlencoded, json } = express;

// Initialize redis client.
const client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');

// Use middlewares.
app.use(cors({ credentials: true, origin: true }));
app.options('*', cors());
app.use(morgan('dev'));
app.use(urlencoded({ extended: true }));
app.use(json());

// Initialize server listening.
app.listen(process.env.PORT || 3002, () => {
  console.log('server listening on port 3002');
});

// Main method.
const scrapeData = async () => {
  const generalUrl = 'https://onemocneni-aktualne.mzcr.cz/covid-19';
  const hospitalizationUrl = 'https://onemocneni-aktualne.mzcr.cz/covid-19/prehled-hospitalizaci';
  let html = await fetch(generalUrl).then((x) => x.text());
  html += await fetch(hospitalizationUrl).then((x) => x.text());
  const $ = cheerio.load(html);

  return dataParser($, generalUrl);
};

// Server route.
app.get('/data', async (_req, res) => {
  try {
    client.get('data', async (_err, result) => {
      let data;
      if (result) {
        data = result;
      } else {
        data = await scrapeData();
        client.setex('data', 300, JSON.stringify(data));
      }
      res.send(data);
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
