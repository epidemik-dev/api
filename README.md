# Epidemik

[![Build Status](https://travis-ci.org/epidemik-dev/api.svg?branch=master)](https://travis-ci.org/epidemik-dev/api)

Epidemik is a crowdsourced disease data collector. Users report when they are sick, and the app gives them a map where other users are sick, notificaitons when illnesses are growing, and a simple trends view that shows which diseases are around. All the data is aunonomous, and will only be shared with other users and research groups. 

You can view the web app at http://epidemik.us or download Epidemik from the app store!

Important Info For Developers:

Required Setup:

1. Install and Run a MySQL server. Create a database EPIDEMIK_TEST and EPIDEMIK
2. Run npm install
3. Create a .env file in the main folder. 
Required Fields:

DB_HOST=?<br>
DB_USER=?<br>
DB_PASS=?<br>
JWT_SECRET=?<br>
ADMIN_PASSWORD=?

4. Run "npm test" or "npm start"
