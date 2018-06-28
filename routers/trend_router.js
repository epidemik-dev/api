const express = require('express');

const trend_route = express.Router();

const all_trends = require('../main/trends/all_trends.js');
const historical_trends = require('../main/trends/historical/historical_trends.js');
const user_location_trends = require('../main/trends/userID/user_location_trends.js');

trend_route.get('/', all_trends.get_all_trends);

trend_route.get('/historical', historical_trends.get_historical_trends);

trend_route.get('/:userID', user_location_trends.get_all_trends);

module.exports = trend_route;