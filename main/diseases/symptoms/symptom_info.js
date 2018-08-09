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
            27: "I have mouth sores",
            28: "I have bloating",
            29: "I have swollen lymph nodes",
            30: "My neck is stiff",
            31: "I have joint pain",
            32: "My memory is feeling poor",
            33: "I have been bitten by a tick",
            34: "I have shortness of breath",
            35: "I have chest pain",
            36: "I am losing weight quickly",
            37: "I am coughing up blood"
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
            "Common Cold":  [1, 2, 3, 4, 5],//Not updated yet
            "Influenza (Flu)": [6, 2, 7, 8, 4],//Not updated yet
            "Gastroenteritis (Stomach Flu)": [9, 10, 11, 12, 2, 28, 5, 18],
            "Staph Infection": [14, 13, 15, 16, 2],
            "Strep Throat": [17, 13, 2, 18, 5], //Not updated yet
            "Lyme Disease": [6,5,7,18,29,19,30,31,32],
            "Tuberculosis": [20,34,35,2,21,36,37],
            "Pink Eye": [23,24,26,25,3],
            "Hand Foot and Mouth": [2,17,20,16,5],
            "Other": [1, 2, 3, 4, 5, 6]
        },
        body_part_question_map: {
            "head": [1,2,3,4,5,8,9,17,23,24,25,26,27,29,30,32],
            "chest": [8,20,34,35,37],
            "full": [6,7,8,11,12,13,14,15,16,18,19,21,22,31,33,36],
            "stomach": [9,10,11,12,22,28],
            "arms": [12,13,15,16,19],
            "legs": [12,13,15,16,19,33],
            "neck": [1,2,3]
        }
    }
    req.http_responses.report_success_with_info(req, res, to_send);
}

module.exports = {
    get_symptom_info: get_symptom_info
}