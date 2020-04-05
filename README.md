# Novel Coronavirus COVID-19 API

This is an API for the Novel Coronavirus (COVID-19) Statistics.

Source of data for this API is [Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE) Github Repository](https://github.com/CSSEGISandData/COVID-19).

## What COVID-19 Stats API provides

Using API, you can search COVID-19 confirmed, death and recovered cases all around the world. To start the server, please run following command while being at root of project

      node index.js

This will start a server at port 3000.

### List of available API

Case types are confirmed, deaths and recovered. Open API 3 Spec is present in repo with name `open-api-3-spec.yml`.

      baseurl = http://localhost:3000/v1/api

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
