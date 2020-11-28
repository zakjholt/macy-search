const express = require("express");
const path = require("path");
const elasticsearch = require("elasticsearch");

const elastic = new elasticsearch.Client({
  host: "localhost:9200",
  log: "trace",
});

const searchRecords = async (query) => {
  const response = await elastic.search({
    index: "recipe_pdfs",
    q: `text:${query}`,
  });

  return response.hits.hits;
};

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/drinks", async (req, res) => {
  const { search } = req.query;

  if (!search) {
    res.status(400).send("Must pass a ?search param");
    return;
  }

  const results = await searchRecords(search);

  res.send({ search, results });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
