function filter_disease_name(req, res, next) {
    req.params.diseaseID = req.params.diseaseID.replace("-", " ");
    next();
}

module.exports = {
    filter_disease_name: filter_disease_name
}