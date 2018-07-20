function get_disease_information(req, res) {
    let disease_name = req.params.disease_name;
    var to_send;
    if(disease_name === "Flu") {
        to_send = {
            medicine: ["motrin"],
            doctor: true
        }
    }
    req.http_responses.report_success_with_info(req, res, to_send);
}

module.exports = {
    get_disease_information:get_disease_information
}