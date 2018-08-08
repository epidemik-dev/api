const disease_information = require("../../../../helpers/disease_helpers.js").disease_information

function get_disease_information(req, res) {
    console.log(req.params.diseaseID, "hello");
    let disease_name = req.params.diseaseID.toLowerCase();
    var to_send = disease_information[disease_name];
    if(to_send == undefined) {
        to_send = disease_information["default"];
        to_send.disease_name = req.params.diseaseID;
    }
    
    req.http_responses.report_success_with_info(req, res, to_send);
}

module.exports = {
    get_disease_information: get_disease_information
}