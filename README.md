# Tagup back-end Technical Challenge

Thanks for your interest in me joining the team! This repository is a submission
for you to evaluate my technical abilities in advance of meeting in person.  It
was crafted with love in time of turmoil as a response to a [challenge](https://github.com/tagup/challenges/tree/master/backend).
I hope it finds you well and meets your expectations for a platform on which
conversation might continue toward mutual benefit.




## Project Description

I have created a simple REST API connected to a local database which enables
clients to save, modify, delete, and output data records (e.g. CRUD tooling).
SQLite was chosen for a storage implementation, making the data truly local to
the service.  A NodeJS runtime was chosen for the near ubiquity of JavaScript.


## Technical Requirements

### Data Format

The format for a standard data record that this API accepts is a JSON format
containing the following properties (all time values in milliseconds):

- id: A unique record ID (automatically generated by the database)
- timestamp : The unix time the record was created
- value1: A string
- value2: A float
- value3: A boolean
- creationDate: The unix time the record was first saved to the database
- lastModificationDate: The unix timestamp of the last record update

For example, The JSON notation of this object will look like:
```JS
{
  "id": "d906ae95-61e6-4858-add4-5670d4639e70",
  "timestamp": 1600203282420,
  "value1": "foo",
  "value2": 0.123,
  "value3": false,
  "creationDate": 1600203282457,
  "lastModificationDate": 1600203282457
}
```

### API Endpoints

| Route                 | Method | Description |
| --                    | --     | -- |
| /api/list             | GET    | List all records |
| /api/read/:recordId   | GET    | Read a specific record |
| /api/create           | POST   | Create a record ** |
| /api/modify/:recordId | POST   | Update a specific record |
| /api/remove/:recordId | POST   | Delete a specific record |

** The record object should be sent using the format below. Fields not shown
are automatically generated on the back end.
```JS
{
  "timestamp": <timestamp>,
  "value1": <string>,
  "value2": <float>,
  "value3": <boolean>
}
```

### Response format

Endpoints return a JSON response.  Exposed data to API consumers contains:

- the unique ID (default name generally defined by the DB)
- the timestamp provided during the creation of the record
- the value 1 provided during the creation of the record
- the value 2 provided during the creation of the record
- the value 3 provided during the creation of the record


## Service Usage

You've located my source code submission on [GitHub](https://github.com/zossz/tags).
A live deployment may be found on [Heroku](https://calm-plateau-99552.herokuapp.com/).
To experiment locally (assuming you have `docker-compose` and `make` installed,
configured, and exported to your shell executable path) simply check out the
code, navigate into the project directory, and run:

	`make`

To remove any resources created while testing the `tags` service sandbox:

	`make clean`

Barring use of that tooling, to run the NodeJS service directly:

	`npm ci && npm run debug`

API calls may be executed immediately:

	`curl -s http://localhost:8080/api | jq -M`

	`curl -s https://calm-plateau-99552.herokuapp.com/api | jq -M`

Opening a browser to http://localhost:8080/ reveals another way to interact
with the service during development on the default port.  Override is possible
via `process.env.EXPRESS_PORT`.

Hints for container orchestration commands and other code repo operations may be
found in the `./Makefile`.


## Data Migrations

- The `sequelize-cli` library simplifies managing our database:
```
user@pc:~/lib/tags$ npx sequelize-cli init \
	--config etc/sequelize.json \
	--migrations-path lib/data/migrations \
	--models-path lib/data/models \
	--seeders-path lib/data/fixtures

Sequelize CLI [Node: 12.18.0, CLI: 6.2.0, ORM: 6.3.5]

Created "etc/sequelize.json"
Successfully created models folder at "/home/user/lib/tags/lib/data/models".
Successfully created migrations folder at "/home/user/lib/tags/lib/data/migrations".
Successfully created seeders folder at "/home/user/lib/tags/lib/data/fixtures".
```

- The `sequelize-cli [ command ] --help` argument yields detailed guidance:
```
user@pc:~/lib/tags$ npx sequelize-cli  # also shown by default
🌠
```

### Roadmap

The [manual](https://sequelize.org/master/manual/resources.html) provides
resource listings including integration of Joi schema validation against JSONB
records in a PostgreSQL database which may prove useful in ensuring consistent
reads via service requests where API scaling of distributed clients occurs.

For now we're using SQLite in order to simplify deploy and demo, but model
definitions are not expected to change as configs are tweaked for integrating
the ORM with a new data source.  The `sqlite3` package effortlessly includes
this battle tested [database engine](https://sqlite.org/about.html).

With deployment to various environments, our `NODE_ENV` will affect varied
behavior dependent on env-specific values.  Care should be taken to map values
to those described in `./etc/sequelize.json` as well as `./.sequelizerc` when
using the CLI.

Another item worth consideration is the [migration](https://github.com/sequelize/umzug)
tool built as a companion to Sequelize.  Not strictly necessary on 2-pizza
teams, but programmatic customization and event response opportunity abounds.


## Contributions

Pull requests, bug reports, inquiries, and tips welcome.