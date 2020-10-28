import cheerio from 'cheerio';

import { dataParser } from './data-parser';

const scrapeData = async () => {
  const generalUrl = 'https://onemocneni-aktualne.mzcr.cz/covid-19';
  const hospitalizationUrl = 'https://onemocneni-aktualne.mzcr.cz/covid-19/prehled-hospitalizaci';
  let html = await fetch(generalUrl).then((x) => x.text());
  html += await fetch(hospitalizationUrl).then((x) => x.text());
  const $ = cheerio.load(html);

  console.log(dataParser($, generalUrl));
};

scrapeData();
