# 2019 Novel Coronavirus COVID-19 API

This is an API for the 2019 Novel Coronavirus<br>
Source of data for this API is Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE).
<br>

<b>What COVID-19 Stats API provides ?</b><br>
Using API, you can search COVID-19 confirmed, death and recovered cases all around the world.<br>
baseurl = http://localhost:3000/v1/api<br>
case types are confirmed, deaths and recovered

<b>List of available API</b><br>
1. Get information on all types of cases for all countries<br>
   endpoint = /cases

2. Get information on all types of cases for particular country<br>
   endpoint = /cases?country=countryname<br>
   example: /cases?country=India

3. Get information about particular case for all countries<br>
   endpoint = /cases/country/:casetype<br>
   example: /cases/country/confirmed

4. Get information about particular case found in all states of differnt countries <br>
   endpoint = /cases/state/:casetype<br>
   example: /cases/state/confirmed

5. Get information about particular case found in all states of particular countries <br>
   endpoint = /cases/state/:casetype?country=countryname<br>
   example: /cases/state/confirmed?country=India

6. To Refresh COVID-19 server data with latest data provided by JHU CSSE<br>
    endpoint = /refresh<br>
