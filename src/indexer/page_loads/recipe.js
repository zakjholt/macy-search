const axios = require("axios");
const cheerio = require("cheerio");

async function loadRecipe(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

module.exports = { loadRecipe };
