function get_disease_symptoms(req, res) {
    req.diseaseDB.get_disease_name_symptoms(req.params.diseaseID).then(result => {
        req.http_responses.report_sucess_with_info(req, res, result);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    })
}

module.exports = {
    get_disease_symptoms: get_disease_symptoms
}