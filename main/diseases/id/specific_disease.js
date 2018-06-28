function get_disease_info(req, res) {
    req.diseaseDB.get_diseases_for_name(req.query.region.latMin, req.query.region.latMax, 
        req.query.region.longMin, req.query.region.longMax, req.params.diseaseID).then(result => {
        req.http_responses.report_sucess_with_info(req, res, result);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    })
}

module.exports = {
    get_disease_info: get_disease_info
}