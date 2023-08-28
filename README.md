# Test server serving data by tiles and bbox

- [API&Demo](https://mappable-test-server-d7778c5d7460.herokuapp.com/v1/api_docs/)
- [Contributing](./CONTRIBUTING.md)
- [License](./LICENSE)

The test server demonstrates work with subloading data by tiles and by bbox (lower left, upper right points).

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





