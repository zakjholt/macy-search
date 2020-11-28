const uniq = require("lodash/uniq");
const identity = require("lodash/identity");
const fs = require("fs");
const pdf = require("pdf-parse");
const elasticsearch = require("elasticsearch");

const { loadIndex } = require("./page_loads");
const { loadRecipe } = require("./page_loads/recipe");
const prompts = require("prompts");

const HREF_BLACKLIST = ["https://www.tommacy.com/recipes"];
const extractLinkHref = (index, recipePage) => {
  const href = recipePage.attribs.href;

  return href;
};

const getRecipePdfLink = async (url) => {
  const $page = await loadRecipe(url);

  console.log(`loading url: ${url}`);
  const pdfLink = $page(".dm1link").attr("href");

  return pdfLink;
};

const fetchPdfLinks = async () => {
  const $index = await loadIndex();

  const recipeLinks = $index(".txtNew .font_8 a, .txtNew .font_7 a");

  const links = recipeLinks.map(extractLinkHref);

  const cleanLinks = uniq(
    links.filter((link) => !HREF_BLACKLIST.includes(link) && identity(link))
  );

  const pdfLinks = [];
  for (let link of cleanLinks) {
    try {
      const pdfLink = await getRecipePdfLink(link);

      const drinkName = link.split("/").reverse()[0];

      pdfLink && pdfLinks.push({ [drinkName]: pdfLink });
    } catch (err) {
      console.log(err);
    }
  }

  fs.writeFileSync("pdfLinks.json", JSON.stringify(pdfLinks));
};

const buildRecords = async () => {
  const linkMaps = require("../pdfLinks.json");

  const records = [];
  for (let linkMap of linkMaps) {
    try {
      const [drinkName, pdfLink] = Object.entries(linkMap)[0];
      const pdfData = await pdf(pdfLink);

      const record = {
        name: drinkName,
        text: pdfData.text,
        pdfLink,
      };

      records.push(record);
    } catch (err) {
      console.log(err);
    }
  }

  fs.writeFileSync("records.json", JSON.stringify(records));
};

const elastic = new elasticsearch.Client({
  host: "localhost:9200",
  log: "trace",
});

const indexRecords = async () => {
  const records = require("../records.json");

  for (let record of records) {
    try {
      await elastic.index({
        index: "recipe_pdfs",
        type: "recipe",
        body: record,
      });
    } catch (err) {
      console.log("all is unwell");
      console.log(err);
    }
  }
};



// indexRecords();
// buildRecords();
// main();
