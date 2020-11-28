const express = require("express");
const path = require("path");

const { client, ELASTICSEARCH_INDEX } = require("../db/elasticsearch");

const searchRecords = async (query) => {
  const response = await client.search({
    index: ELASTICSEARCH_INDEX,
    q: `text:${query}`,
    analyzer: "keyword",
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
  console.log(`App listening on ${port}`);
});
