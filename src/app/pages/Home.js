import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid, Heading, Input } from "@chakra-ui/react";
import debounce from "lodash/debounce";

import { Result } from "../components/Result";

const search = async (query) => {
  const { data } = await axios("/api/drinks", { params: { search: query } });

  return data.results;
};

const formatResult = (result) => {
  const { _source } = result;
  return {
    name: _source.name,
    pdfLink: _source.pdfLink,
  };
};

const useSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    (async () => {
      const newResults = await search(query);
      setResults(newResults);
    })();
  }, [query]);

  const debouncedSetQuery = debounce(setQuery);

  const formattedResults = results.map(formatResult);

  return {
    query,
    setQuery: debouncedSetQuery,
    results: formattedResults,
  };
};
export const Home = () => {
  const { query, setQuery, results } = useSearch();

  return (
    <Container>
      <Heading>Search for drinks</Heading>
      <Input
        size="lg"
        placeholder="search"
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
      />
      <Grid padding={4} gap={4}>
        {results.map((result) => (
          <Result {...result} />
        ))}
      </Grid>
    </Container>
  );
};
