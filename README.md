# Test server for returning data by tiles and bbox

[API&Demo](https://mappable-test-server-d7778c5d7460.herokuapp.com/v1/api_docs/)

The test server demonstrates work with subloading data by tiles and by bbox (lower left, upper right points).

You can use to start [docker-compose](https://docs.docker.com/compose/).

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





