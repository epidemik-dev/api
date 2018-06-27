function add_disease(req, res) {
    var disease_name = req.body.disease_name;
    var date_sick = req.body.date_sick;
    var date_healthy = req.body.date_healthy;
    var username = req.body.username;
    var symptoms = req.body.symptoms;
    req.diseaseDB.add_disease(disease_name, date_sick, date_healthy, username, symptoms).then(result => {
        req.http_responses.report_sucess_no_info(req, res);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    });
}

function mark_healthy(req, res) {
    req.diseaseDB.mark_healthy(req.query.date_healthy, req.params.userID).then(result => {
        req.http_responses.report_sucess_no_info(req, res);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    })
}

module.exports = {
    add_disease: add_disease,
    mark_healthy: mark_healthy
}