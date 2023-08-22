# Contributing

Required to run  [docker-compose](https://docs.docker.com/compose/)

```sh
git clone git@github.com:mappable-world/mappable-test-server.git
cd mappable-test-server
touch .env
```

Editing the `.env` file. In it, we indicate with what login and password the test database will be created and how to connect to it.

В таком формате:
```dotenv
DB_NAME=api
DB_USER=postgres
DB_PASSWORD=secret007
DB_HOST=localhost
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="secret007"
PGADMIN_DEFAULT_EMAIL: postgres@admin.com
PGADMIN_DEFAULT_PASSWORD: qwertyuiop
```

We start services:

```sh
docker-compose up -d
```

The test application, the database server and the pgadmin database administrator will be raised
The `api` database and the `points` table will be automatically created in the database.

You can check if it works by opening `http://localhost:8080`

To view the database, you can visit http://localhost:8999/browser/ login and password from `.env`

For local development, it is enough to start only the database:

```sh
docker-compose up db -d
```

In file

And start the server in debug mode:

```sh
npm start
```

Any changes to the files will automatically restart the test server.

To run autotests:

```sh
npm test
```

When you're done, update the version, add the new tag, and push everything to github. Github actios will automatically roll out the new version to heroku.
