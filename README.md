# Test Server for Serving Data by Tiles and Bbox

- [API & Demo](https://mappable-test-server-d7778c5d7460.herokuapp.com/v1/api_docs/)
- [Contributing](./CONTRIBUTING.md)
- [License](./LICENSE)

To set up the test server, you can obtain data from the website http://geojson.xyz/.
Choose any file that contains points on the map.
Then, create an SQL file using the following command:

For example:

```sh
ts-node ./src/tools/geojson-to-table-points-sql.ts https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_admin_1_label_points.geojson ./points.sql
docker compose exec db psql -U postgres api < ./points.sql
```

The test server demonstrates how to load data by tiles and bbox (lower left and upper right points).
You can make a POST request to the server's /v1/bbox endpoint to retrieve data within a specific bounding box:

```sh
curl -X 'POST' \
  'https://mappable-test-server-d7778c5d7460.herokuapp.com/v1/bbox' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "leftBottom": [
    24,
    54
  ],
  "rightTop": [
    24,
    54
  ]
}'
```

This will return the data within the specified bounding box.
Please refer to the [API & Demo](https://mappable-test-server-d7778c5d7460.herokuapp.com/v1/api_docs/) for more details on the available endpoints and their usage.




