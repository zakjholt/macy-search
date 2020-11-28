# Macy Cocktail Search

This is a standalone application for building a searchable index application of tommacy.com

## To Run

```
docker-compose up -d --build
```

Wait a little while; it will take some time on first run for:

- Elasticsearch docker image to pull
- Application docker image to build
- The indexer to crawl tommacy's site and build the database.

Feel free to tail the logs with:

```
docker-compose logs -f server
```

When things are stable, visit localhost:3000
