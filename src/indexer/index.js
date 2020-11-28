const uniq = require("lodash/uniq");
const identity = require("lodash/identity");
// const fs = require("fs");
const pdf = require("pdf-parse");
const { client, ELASTICSEARCH_INDEX } = require("../db/elasticsearch");

const { loadIndex } = require("./page_loads");
const { loadRecipe } = require("./page_loads/recipe");

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

  // fs.writeFileSync("pdfLinks.json", JSON.stringify(pdfLinks));
  return pdfLinks;
};

const buildRecords = async (linkMaps) => {
  // const linkMaps = require("../pdfLinks.json");

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

  // fs.writeFileSync("records.json", JSON.stringify(records));
  return records;
};

const indexRecords = async (records) => {
  // const records = require("../records.json");

  for (let record of records) {
    try {
      await client.index({
        index: ELASTICSEARCH_INDEX,
        type: "recipe",
        body: record,
      });
    } catch (err) {
      console.log("all is unwell");
      console.log(err);
    }
  }
};

const main = async () => {
  // Check to see if the index is already created (if we've already run this indexer)
  const exists = await client.indices.exists({
    index: ELASTICSEARCH_INDEX,
  });

  if (exists) {
    console.log("Elasticsearch index already exists. No-op");
    return;
  } else {
    const pdfLinks = await fetchPdfLinks();
    const records = await buildRecords(pdfLinks);
    await indexRecords(records);
    console.log("Records indexed");
  }
};

main();
