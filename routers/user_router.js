const express = require('express');
const auth_helpers = require('../helpers/auth_helpers.js');

const all_users = require("../main/users/all_users.js")
const single_user = require('../main/users/id/single_user.js');
const user_diseases = require('../main/users/id/diseases/user_diseases.js');
const single_disease = require('../main/users/id/diseases/id/single_disease.js');
const single_symptom = require('../main/users/id/diseases/id/symptoms/id/single_symptom.js');
const disease_symptoms = require('../main/users/id/diseases/id/symptoms/disease_symptoms.js');
const user_symptoms = require('../main/users/id/symptoms/user_symptoms.js');
const current_sickness = require('../main/users/id/sickness/current_sickness.js');

const user_route = express.Router();

// Verifies the given JWT
user_route.use(auth_helpers.verifyJWT);
// If these params are present, these helpers should be run
user_route.param('userID', auth_helpers.canViewUser);
user_route.param('diseaseID', auth_helpers.canViewDisease);

// Returns every users info
user_route.get("/", auth_helpers.hasAdminPriv, all_users.get_all_users);
// Delete themselves and all their info
user_route.delete('/:userID', single_user.delete_user);
// Changes this users pasword
user_route.put('/:userID', single_user.change_password);
// Changes this users address
user_route.patch('/:userID', single_user.change_address);
// Returns all info about this user
user_route.get('/:userID', single_user.get_info);
// Add a disease to their account
user_route.post('/:userID/diseases', user_diseases.add_disease);
// Deletes all of this users healthy diseases
user_route.delete('/:userID/diseases', user_diseases.delete_healthy);
// Say they are healthy
user_route.patch('/:userID/diseases', user_diseases.mark_healthy);
// Returns all of this users diseases
user_route.get('/:userID/diseases', user_diseases.get_all_disease);
// Delete a disease and associated info
user_route.delete('/:userID/diseases/:diseaseID', single_disease.delete_disease);
// Returns all info about this infection
user_route.get('/:userID/diseases/:diseaseID', single_disease.get_disease);
// Gets the symptoms for this disease
user_route.get('/:userID/diseases/:diseaseID/symptoms', disease_symptoms.get_symptoms);
// Delete this symptom point
user_route.delete('/:userID/diseases/:diseaseID/symptoms/:symID', single_symptom.delete_symptom);
// Adds a symptom to this users current list
user_route.post('/:userID/symptoms', user_symptoms.add_symptom);
// Adds a symptom to this users current list
user_route.get('/:userID/symptoms', user_symptoms.get_symptoms);
// Adds a symptom to this users current list
user_route.get('/:userID/sickness', current_sickness.is_user_sick);


module.exports = user_route;