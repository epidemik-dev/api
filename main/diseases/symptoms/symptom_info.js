function get_symptom_info(req, res) {
    var to_send = {
        symptom_map: {
            1: "I have a runny nose",
            2: "I have a fever",
            3: "My eyes are watering",
            4: "I am sneezing a lot",
            5: "I have a headache",
            6: "I have chills",
            7: "I am fatigued",
            8: "I am congested",
            9: "I have vomited today",
            10: "I have diarrhea",
            11: "I am nauseous",
            12: "I have cramps",
            13: "I have swelling",
            14: "I am feeling very itchy",
            15: "I have a rash",
            16: "I have blisters",
            17: "I have a sore throat",
            18: "I am aching all over",
            19: "I have a bull's eye rash",
            20: "I have a cough",
            21: "I am sweating at night",
            22: "I am not hungry",
            23: "My eyes are itchy",
            24: "My eyes are red",
            25: "I have discharge",
            26: "My eyes are swelling",
            27: "I have mouth sores"
        },
        disease_list: [
            "Common Cold",
            "Influenza (Flu)",
            "Strep Throat",
            "Gastroenteritis (Stomach Flu)",
            "Staph Infection",
            "Lyme Disease",
            "Tuberculosis",
            "Hand Foot and Mouth",
            "Pink Eye",
            "Other"
        ],
        disease_question_map: {
            "Common Cold":  [1, 2, 3, 4, 5],
            "Influenza (Flu)": [6, 2, 7, 8, 4],
            "Gastroenteritis (Stomach Flu)": [9, 10, 11, 12, 2],
            "Staph Infection": [13, 14, 15, 2, 16],
            "Strep Throat": [17, 13, 2, 18, 5],
            "Lyme Disease": [19, 2, 5, 7, 18],
            "Tuberculosis": [20, 21, 6, 7, 22],
            "Pink Eye": [23, 3, 24, 25, 26],
            "Hand Foot and Mouth": [15, 16, 20, 5, 27],
            "Other": [1, 2, 3, 4, 5]
        },
        body_part_question_map: {
            "head": [1,2,3],
            "chest": [4,5,6]
        }
    }
    req.http_responses.report_success_with_info(req, res, to_send);
}

module.exports = {
    get_symptom_info: get_symptom_info
}