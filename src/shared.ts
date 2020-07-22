/* const sleep = ms => new Promise(r => setTimeout(r, ms));
const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
module.exports.sleep = () => sleep(randomInt(1, 1000));
module.exports.DATE = new Date().valueOf();
 */

/* const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const shared = require("./shared");

const { DATE, sleep } = shared;

const dataWriter = createCsvWriter({
  path: `data/${DATE}-index.csv`,
  header: ["id", "name", "tagline", "profile", "website", "directory", "page"]
});
const errorWriter = createCsvWriter({
  path: `data/${DATE}-index-error.csv`,
  header: ["directory", "page"]
});
 */
