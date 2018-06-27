function delete_disease(req, res) {
    req.diseaseDB.delete_disease(req.params.diseaseID).then(() => {
        req.http_responses.report_sucess_no_info(req, res);
    }).catch(error => {
        throw error;
        req.http_responses.report_not_found(req, res);
    });
}

module.exports = {
    delete_disease: delete_disease
}