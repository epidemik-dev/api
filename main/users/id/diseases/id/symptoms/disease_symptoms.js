function get_symptoms(req, res) {
    req.diseaseDB.get_disease_symptoms(req.params.diseaseID).then(result => {
        req.http_responses.report_success_with_info(req, res, result);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    })
}

module.exports = {
    get_symptoms: get_symptoms
}