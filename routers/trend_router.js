const express = require('express');
const auth_helpers = require('../helpers/auth_helpers.js');

const trend_route = express.Router();

const all_trends = require('../main/trends/all_trends.js');
const historical_trends = require('../main/trends/historical/historical_trends.js');
const user_location_trends = require('../main/trends/userID/user_location_trends.js');

// Verifies the given JWT
trend_route.use(auth_helpers.verifyJWT);
// If these params are present, these helpers should be run
trend_route.param('userID', auth_helpers.canViewUser);

// The user is trying to get trends for a specific cordinate
trend_route.get('/', all_trends.get_all_trends);
// The user is trying to get trends for history at a location
trend_route.get('/historical', historical_trends.get_historical_trends);
// The user is trying to get trends for THEIR region
trend_route.get('/:userID', user_location_trends.get_all_trends);

module.exports = trend_route;