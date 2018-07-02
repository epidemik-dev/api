function get_disease_info(req, res) {
    req.diseaseDB.get_diseases_for_name(req.query.region.lat_min, req.query.region.lat_max, 
        req.query.region.long_min, req.query.region.long_max, req.params.diseaseID).then(result => {
        req.http_responses.report_sucess_with_info(req, res, result);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    })
}

module.exports = {
    get_disease_info: get_disease_info
}