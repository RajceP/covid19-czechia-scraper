import cheerio from 'cheerio';

import { dataParser } from '../data-parser';
import { testData } from '../test/test-data';

const scrapeData = () => {
  const $ = cheerio.load(testData);

  console.log(dataParser($, 'TEST DATA'));
};

scrapeData();
