# Test Server for Serving Data by Tiles and Bbox

- [API & Demo](https://mappable-test-server-d7778c5d7460.herokuapp.com/v1/api_docs/)
- [Contributing](./CONTRIBUTING.md)
- [License](./LICENSE)

To set up the test server, you can obtain data from the website http://geojson.xyz/.
Choose any file that contains points on the map.
After that, you can load the data into the database on your test service.

For example:

```sh
docker compose exec web POINTS_JSON=https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_admin_1_label_points.geojson node ./dist/tools/geojson-to-table-points-sql.js
```

The test server demonstrates how to load data by tiles and bbox (lower left and upper right points).
You can make a POST request to the server's /v1/bbox endpoint to retrieve data within a specific bounding box:

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




