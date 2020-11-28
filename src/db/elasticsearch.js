const elasticsearch = require("elasticsearch");

const ELASTIC_HOST = process.env.ELASTIC_HOST || "localhost:9200";
const client = new elasticsearch.Client({
  host: ELASTIC_HOST,
  log: "trace",
});

const ELASTICSEARCH_INDEX = "recipe_pdfs";

module.exports = { client, ELASTICSEARCH_INDEX };
