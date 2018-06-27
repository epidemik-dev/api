function add_symptom(req, res) {
    req.diseaseDB.add_symptom(req.params.userID, req.body.symID).then(result => {
        req.http_responses.report_sucess_with_info(req, res, result);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    });
}

function get_symptoms(req, res) {
    req.diseaseDB.get_user_symptoms(req.params.userID).then(result => {
        req.http_responses.report_sucess_with_info(req, res, result);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    })
}

module.exports = {
    add_symptom: add_symptom,
    get_symptoms: get_symptoms
}