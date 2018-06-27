const express = require('express');

const auth_helpers = require('../helpers/auth_helpers.js')

const single_user = require('../main/users/id/single_user.js')
const user_diseases = require('../main/users/id/diseases/user_diseases.js')
const single_disease = require('../main/users/id/diseases/id/single_disease.js')

const user_route = express.Router();

user_route.use(auth_helpers.verifyJWT);

// If these params are present, these helpers should be run
user_route.param('userID', auth_helpers.canViewUser);
// Delete themselves and all their info
user_route.delete('/:userID', single_user.delete_user);
// Changes this users pasword
user_route.put('/:userID', single_user.change_password);
// Add a disease to their account
user_route.post('/:userID/diseases', user_diseases.add_disease);
// Say they are healthy
user_route.patch('/:userID/diseases', user_diseases.mark_healthy);
// Delete a disease and associated info
user_route.delete('/:userID/diseases/:diseaseID', single_disease.delete_disease);

module.exports = user_route;