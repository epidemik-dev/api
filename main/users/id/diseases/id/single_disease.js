function delete_disease(req, res) {
    req.diseaseDB.delete_disease(req.params.diseaseID).then(() => {
        req.http_responses.report_success_no_info(req, res);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    });
}

function get_disease(req, res) {
    req.diseaseDB.get_disease(req.params.userID, req.params.diseaseID).then(result => {
        req.http_responses.report_success_with_info(req, res, result);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    });
}

module.exports = {
    delete_disease: delete_disease,
    get_disease: get_disease
}