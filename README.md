# BackEnd Portfolio Project - News API
**Summary**
News Api is built using express . It allow the client to GET articles, users , comments and topics , which can be sorted and filtered using queries . It also allows for POST , PATCH and DELETE requests . Full details of all endpoints can be found at endpoints.json

The hosted version can be found at https://mh-news-station.herokuapp.com/

# Installation 
You wil need the following dependencies to run this repo :

    1. Node (minimum version ^18.6.0)

    2. Postgres (minimum version ^8.7.3)

To run this repo locally you will need to:
    1. Clone the repo - Click the green code button copy the https link. Then in the folder where you want to clone open a terminal and run git clone THE_URL

    2. Next in the cli run > npm install , this is to install all the dependencies mentioned above .

    3.To create the databases run > npm run setup-dbs

    4. And to seed the database > npm run seed

    5.To run the tests you will need to install jest > npm install jest and an extention jest-sorted > npm install jest-sorted

    6. This repo will also require you to make two .env files > .env.test and .env.development , this will change the database used depending on wether you are running tests or not 