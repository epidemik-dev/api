const express = require('express');
const auth_helpers = require('../helpers/auth_helpers.js');

const all_diseases = require('../main/diseases/all_diseases.js');

const disease_route = express.Router();

disease_route.use(auth_helpers.verifyJWT);

disease_route.get('/', all_diseases.get_diseases);

module.exports = disease_route;