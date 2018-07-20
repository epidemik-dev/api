const express = require('express');
const auth_helpers = require('../helpers/auth_helpers.js');
const disease_helpers = require('../helpers/disease_helpers.js');

const all_diseases = require('../main/diseases/all_diseases.js');
const symptom_info = require('../main/diseases/symptoms/symptom_info.js');
const specific_disease = require('../main/diseases/id/specific_disease.js');
const disease_symptoms = require('../main/diseases/id/symptoms/disease_symptoms.js');
const disease_information = require('../main/diseases/id/information/disease_information.js');

const disease_route = express.Router();

// Verifies the given JWT
disease_route.use(auth_helpers.verifyJWT);

// Verifies the JWT
disease_route.use(auth_helpers.verifyJWT);
// Replaces - with space
disease_route.param("diseaseID", disease_helpers.filter_disease_name);

// Returns every disease point that is currently sick
disease_route.get('/', all_diseases.get_diseases);
// Returns info about the symptoms we use to diagnose people
disease_route.get('/symptoms', symptom_info.get_symptom_info);
// Returns every disease point where the name matches (- becomes space)
disease_route.get('/:diseaseID', specific_disease.get_disease_info);
// Returns the symptoms for this specific disease
disease_route.get('/:diseaseID/symptoms', disease_symptoms.get_disease_symptoms);
// Returns information about this disease in general
disease_route.get('/:diseaseID/information', disease_information.get_disease_information);

module.exports = disease_route;