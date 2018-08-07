function get_disease_information(req, res) {
    let disease_name = req.params.diseaseID;
    var to_send;
    if(disease_name === "Common Cold") {
        to_send = {
            disease_name: "Common Cold",
            medicines: ["Mucinex - For Cough",
                        "Ibuprofen - For Swelling",
                        "Acetaminophen - For Pain"],
            doctor: 0, //0 = no, 1 = potential, 2 = definitely
            description: "The Common Cold is a mostly harmless viral infection. Symptoms vary greatly and last between a few days and a few weeks."
        }
    } else if(disease_name === "Influenza (Flu)") {
        to_send = {
            disease_name: "Influenza (Flu)",
            medicines: ["Mucinex - For Cough",
                        "Ibuprofen - For Swelling",
                        "Acetaminophen - For Pain"],
            doctor: 1, //0 = no, 1 = potential, 2 = definitely
            description: "The flu is a common viral disease. While in most cases it is not harmful, in sever cases it can lead to death. If symptoms worsen dramatically, seek medical attention."
        }
    } else if(disease_name === "Strep Throat") {
        to_send = {
            disease_name: "Strep Throat",
            medicines: ["Mucinex - For Cough",
                        "Amoxil - Treats Infection",
                        "Herbal Tea - Soothes the Throat"],
            doctor: 1, //0 = no, 1 = potential, 2 = definitely
            description: "Strep Throat is a bacterial infection that causes pain in the throat. Medical attention is recommended if the symptoms last more than two days."
        }
    } else if(disease_name === "Gastroenteritis (Stomach Flu)") {

    } else if(disease_name === "Staph Infection") {

    } else if(disease_name === "Lyme Disease") {

    } else if(disease_name === "Tuberculosis") {

    } else if(disease_name === "Hand Foot and Mouth") {

    } else if(disease_name === "Pink Eye") {

    } else {
        
    }
    req.http_responses.report_success_with_info(req, res, to_send);
}

module.exports = {
    get_disease_information:get_disease_information
}