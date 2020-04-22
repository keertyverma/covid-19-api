# Novel Coronavirus COVID-19 API

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/e3db374a45c3f3a7eec1) [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

This is an API for the Novel Coronavirus (COVID-19) Statistics.

Source of data for this API is [Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE) Github Repository](https://github.com/CSSEGISandData/COVID-19).

Using API, you can search COVID-19 confirmed, death and recovered cases all around the world.

API is hosted with support of Heroku and MongoDB Atlas at https://covid19-stats-api.herokuapp.com . First API call takes time as Heroku moves inactive apps into sleep mode.

## Installation steps

### Deploy via Docker

#### Pre-requisites

   1. [Docker](https://docs.docker.com/engine/installation/)
   2. [Docker Compose](https://docs.docker.com/compose/install/)
   3. Internet connection

#### Steps

1. Navigate to the project root directory where `docker-compose.yml` file is present.
2. Run the following command in the same folder via terminal. It deploys the server using `docker-compose`.

          docker-compose up -d --force-recreate

      Where:
      - **up** creates and starts containers
      - **-d** daemon mode
      - **--force-recreate** Re-creates containers if there any
3. Your server would be running at port `3000` on `localhost`

#### Useful commands

- **docker-compose logs** shows logs from all containers
- **docker logs &lt;container_name&gt;** shows logs from selected container
- **docker-compose down &lt;container_name&gt;** removes existing containers

### Deploy without Docker

#### Pre-requisites

   1. Node (Tested with v12.13.1)
   2. MongoDB (Tested with v4.2)
   3. Internet connection

For MongoDB, I have used [official Docker image](https://hub.docker.com/_/mongo), you can either use the same or install direcly on your system. Default configuration used in project assumes everything default with the Docker image, if you want to change any configuration, change it in your environment specific file in `config` folder.

      "dbHost": "production-db-host",
      "dbPort": "production-db-port",
      "dbName": "production-db-name",
      "dbUsername": "production-db-username",
      "dbPassword": "production-db-password"

MongoDB configuration can also be provided by environment variable `db_connection_string`. If this is provided we skip all the above defined config variables.

There is no need to configure any collection and documents in MongoDB. To start the server, please run following command while being at root of project

      npm install
      node index.js

This will start a server at port `3000` on `localhost`.

If you want to use different port or any other configuration, you can update the same in config file under `config` folder. Here each file represents different config sets and can be chosen by setting `NODE_ENV` environment variable before starting the server. for e.g.

      NODE_ENV=development node index.js

## Accessing local server

1. Make GET request to below url via Postman, for more details visit below section. You can also get this data via opening this link in browser.

        http://localhost:3000/

2. Populate base data by calling below endpoint

        http://localhost:3000/api/v1/refresh

3. To get your data, visit

        http://localhost:3000/api/v1/cases

### List of available APIs

[Public Documentation has been made available](https://documenter.getpostman.com/view/5352730/SzYbyxR5?version=latest). Here is a [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/e3db374a45c3f3a7eec1) button to import the same and test.  Case types are confirmed, deaths and recovered. Open API 3 Spec is present in repo with name `open-api-3-spec.yml`.

      baseurl = http://localhost:3000/api/v1

1. Get information on all types of cases for all countries

         endpoint = /cases

2. Get information on all types of cases for particular country

         endpoint = /cases?country=countryname
         example: /cases?country=India

3. Get information about particular case for all countries

         endpoint = /cases/country/:casetype
         example: /cases/country/confirmed

4. Get information about particular case found in all states of differnt countries

         endpoint = /cases/state/:casetype
         example: /cases/state/confirmed

5. Get information about particular case found in all states of particular countries

         endpoint = /cases/state/:casetype?country=countryname
         example: /cases/state/confirmed?country=India

6. To Refresh COVID-19 server data with latest data provided by JHU CSSE

         endpoint = /refresh
