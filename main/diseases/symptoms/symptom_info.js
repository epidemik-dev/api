var symptom_info = require("../../../helpers/disease_helpers.js").symptom_info;

function get_symptom_info(req, res) {
    var to_send = symptom_info;
    req.http_responses.report_success_with_info(req, res, to_send);
}

module.exports = {
    get_symptom_info: get_symptom_info
}