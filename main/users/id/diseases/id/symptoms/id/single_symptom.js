function delete_symptom(req, res) {
    req.diseaseDB.delete_symptom(req.params.symID).then(result => {
        req.http_responses.report_sucess_no_info(req, res);
    }).catch(error => {
        req.http_responses.report_not_exists(req, res);
    });
}

module.exports = {
    delete_symptom: delete_symptom
}