# Test Server for Serving Data by Tiles and Bbox

- [GitHub](https://github.com/mappable-world/mappable-test-server)
- [API & Demo](https://mappable-test-server-d7778c5d7460.herokuapp.com/v1/api_docs/)
- [Contributing](https://github.com/mappable-world/mappable-test-server/blob/main/CONTRIBUTING.md)
- [License](https://github.com/mappable-world/mappable-test-server/blob/main/LICENSE)

The purpose of the project is to create a test server that shows how data can be
loaded by tiles and bbox (lower left and upper right points).
By making a `GET` request to the `/v1/bbox` endpoint of the server,
you can retrieve the data within a specific bounding box.

There are two example data sources provided: a `database` and a `json` file.

If you install the project without setting any environment variables,
the `json` file will be used as the data source.
The same data provider will be used if `json` is specified
in both the `DATA_PROVIDER` environment variable and in the autotests.

It is intentional that the test server does not utilize data caching.
Its main purpose is to demonstrate how to handle data by tiles and bbox,
such as searching through the `postgis` table and filtering by bbox.

You can use the entire project as a foundation, or just utilize the database structure and data provider.

## Installation

```sh
git clone git@github.com:mappable-world/mappable-test-server.git
cd mappable-test-server
nvm use
npm ci
npm start
```

or using Docker:

```sh
git clone git@github.com:mappable-world/mappable-test-server.git
cd mappable-test-server
docker compose up
```

To set up the test server, you can obtain data from the website http://geojson.xyz/.
Choose any file that contains points on the map.
After that, you can load the data into the database on your test service.

For example:

```sh
docker compose exec web POINTS_JSON=https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_admin_1_label_points.geojson node ./dist/tools/geojson-to-table-points-sql.js
```

The test server demonstrates how to load data by tiles and bbox (lower left and upper right points).
You can make a POST request to the server's /v1/bbox endpoint to retrieve data within a specific bounding box:

## Usage

By bbox:

```sh
curl -X 'https://mappable-test-server-d7778c5d7460.herokuapp.com/v1/bbox?lng1=23&lat1=54&lng2=24&lat2=44'
```

By tile:

```sh
curl -X 'https://mappable-test-server-d7778c5d7460.herokuapp.com/v1/tile?x=1&y=1&z=1'
```

This will return the data within the specified bounding box.
Please refer to the [API & Demo](https://mappable-test-server-d7778c5d7460.herokuapp.com/v1/api_docs/) for more details on the available endpoints and their usage.

## Demo

You can see the demo of the test server here: https://mappable-test-server-d7778c5d7460.herokuapp.com/v1/api_docs/

## Contribution

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details on how to contribute to the project.

