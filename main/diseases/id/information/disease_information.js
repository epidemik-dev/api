function get_disease_information(req, res) {
    let disease_name = req.params.disease_name;
    var to_send;
    ///if(disease_name === "Influenza (Flu)") {
        to_send = {
            disease_name: "Influenza (Flu)",
            medicines: ["motrin"],
            doctor: 0, //0 = no, 1 = potential, 2 = definitely
            description: "This is a disease that has a lot of words."
        }
    //}
    req.http_responses.report_success_with_info(req, res, to_send);
}

module.exports = {
    get_disease_information:get_disease_information
}