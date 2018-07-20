function get_symptom_info(req, res) {
    var to_send = {
        symptom_map: {
            1: "Headache"
        }
    }
    req.http_responses.report_success_with_info(req, res, to_send);
}

module.exports = {
    get_symptom_info: get_symptom_info
}