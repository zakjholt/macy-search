const axios = require("axios");
const cheerio = require("cheerio");

const INDEX_URL = "https://www.tommacy.com/recipes";

async function loadIndex() {
  const { data } = await axios.get(INDEX_URL);
  return cheerio.load(data);
}

module.exports = {
  loadIndex
}