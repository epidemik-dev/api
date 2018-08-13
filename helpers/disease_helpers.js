function filter_disease_name(req, res, next) {
    req.params.diseaseID = req.params.diseaseID.replace(/-/g, " ");
    next();
}

var symptom_info = {
    symptom_map: {
        1: "Runny nose",
        2: "Fever",
        3: "Watery eyes",
        4: "Sneezing a lot",
        5: "Headache",
        6: "Chills",
        7: "Fatigue",
        8: "Congestion",
        9: "Vomited Today",
        10: "Diarrhea",
        11: "Nauseous",
        12: "Cramps",
        13: "Swelling",
        14: "Itchy",
        15: "Rash",
        16: "Blisters",
        17: "Sore throat",
        18: "Aching all over",
        19: "Bull's eye rash",
        20: "Cough",
        21: "Sweating at night",
        22: "Not hungry",
        23: "Itchy eyes",
        24: "Red eyes",
        25: "Discharge",
        26: "Swollen eyes",
        27: "Mouth sores",
        28: "Bloating",
        29: "Swollen lymph nodes",
        30: "Stiff neck",
        31: "Joint pain",
        32: "Poor memory",
        33: "Bitten by a tick",
        34: "Shortness of breath",
        35: "Chest pain",
        36: "Losing weight quickly",
        37: "Coughing up blood",
        38: "Stuffy nose",
        39: "Pain in the gut",
        40: "Swollen tonsils"
    },
    disease_list: [
        "Common Cold",
        "Influenza (Flu)",
        "Strep Throat",
        "Gastroenteritis (Stomach Flu)",
        "Bronchitis",
        "Staph Infection",
        "Lyme Disease",
        "Tuberculosis",
        "Hand Foot and Mouth",
        "Pink Eye",
        "Other"
    ],
    disease_question_map: {
        "Common Cold": [1, 2, 3, 4, 5, 38, 17],
        "Influenza (Flu)": [6, 2, 7, 8, 4, 18, 1],
        "Gastroenteritis (Stomach Flu)": [9, 10, 11, 12, 2, 28, 5, 18],
        "Staph Infection": [14, 13, 15, 16, 2],
        "Strep Throat": [17, 13, 2, 18, 5, 39, 40],
        "Lyme Disease": [6, 5, 7, 18, 29, 19, 30, 31, 32],
        "Tuberculosis": [20, 34, 35, 2, 21, 36, 37],
        "Pink Eye": [23, 24, 26, 25, 3],
        "Hand Foot and Mouth": [2, 17, 20, 16, 5],
        "Other": [1, 2, 3, 4, 5, 6],
        "Bronchitis": [34,20,18,6,7,2,17,38]
    },
    body_part_question_map: {
        "head": [1, 2, 3, 4, 5, 8, 9, 17, 23, 24, 25, 26, 27, 32,38, 40],
        "chest": [8, 20, 34, 35, 37],
        "full": [6, 7, 8, 11, 12, 13, 14, 15, 16, 18, 19, 21, 22, 31, 33, 36],
        "stomach": [9, 10, 11, 12, 22, 28, 39],
        "arms": [12, 13, 15, 16, 19],
        "legs": [12, 13, 15, 16, 19, 33],
        "neck": [29, 18, 26, 14, 15, 30]
    }
}

var disease_information = {
    "common cold": {
        disease_name: "Common Cold",
        medicines: ["Mucinex - For Cough",
            "Ibuprofen - For Swelling",
            "Acetaminophen - For Pain"
        ],
        doctor: 0, //0 = no, 1 = potential, 2 = definitely
        description: "The Common Cold is a mostly harmless viral infection. Symptoms vary greatly and last between a few days and a few weeks."
    },
    "influenza (flu)": {
        disease_name: "Influenza (Flu)",
        medicines: ["Mucinex - For Cough",
            "Ibuprofen - For Swelling",
            "Acetaminophen - For Pain"
        ],
        doctor: 1, //0 = no, 1 = potential, 2 = definitely
        description: "The flu is a common viral disease. While in most cases it is not harmful, in sever cases it can lead to death. If symptoms worsen dramatically, seek medical attention."
    },
    "strep throat": {
        disease_name: "Strep Throat",
        medicines: ["Mucinex - For Cough",
            "Amoxil - Treats Infection",
            "Herbal Tea - Soothes the Throat"
        ],
        doctor: 1, //0 = no, 1 = potential, 2 = definitely
        description: "Strep Throat is a bacterial infection that causes pain in the throat. Medical attention is recommended if the symptoms last more than two days."
    },
    "gastroenteritis (stomach flu)": {
        disease_name: "Gastroenteritis (Stomach Flu)",
        medicines: ["Clarithromycin - Treats Infection",
            "Amoxil - Treats Infection"
        ],
        doctor: 1, //0 = no, 1 = potential, 2 = definitely
        description: "The Stomach Flu is a "
    },
    "staph infection": {
        disease_name: "Staph Infection",
        medicines: ["Cephalexin - Treats Infection",
            "Erythromycin - Treats Infection"
        ],
        doctor: 2, //0 = no, 1 = potential, 2 = definitely
        description: "A Staph Infection is a bacterial infection on the skin or nose. It is treatable by a doctor."
    },
    "lyme disease": {
        disease_name: "Lyme Disease",
        medicines: ["Doxycycline - Treats Infection",
            "Amoxicillin - Treats Infection"
        ],
        doctor: 2, //0 = no, 1 = potential, 2 = definitely
        description: "Lyme Disease is a infection usually caused by a tick bite. It is treatable by a doctor, but if not treated is very serious."
    },
    "tuberculosis": {
        disease_name: "Tuberculosis",
        medicines: ["Ethambutol - Treats Infection",
            "Rifampin - Treats Infection"
        ],
        doctor: 2, //0 = no, 1 = potential, 2 = definitely
        description: "Tuberculosis is a potentially serious infection of the lungs. It is treatable by a doctor and will last between a few weeks and a few months."
    },
    "hand foot and mouth": {
        disease_name: "Hand Foot and Mouth",
        medicines: ["Tylenol - For Pain",
            "Motrin - For Pain",
            "Advil - For Pain"
        ],
        doctor: 1, //0 = no, 1 = potential, 2 = definitely
        description: "Hand Foot and Mouth is a common virus in children that causes sored on the hands, feet, and mouth. It is not treatable by a doctor, but will go away in a few days to weeks."
    },
    "pink eye": {
        disease_name: "Pink Eye",
        medicines: ["Clear Eyes® Redness Reliever Drops - For Eye Pain",
            "Bleph - For Bacterial Treatment"
        ],
        doctor: 2, //0 = no, 1 = potential, 2 = definitely
        description: "Pink Eye is a infection of the eye that causes pain and redness on the eyes. It is treatable by a doctor and will go away in a few days to weeks."
    },
    "bronchitis": {
        disease_name: "Bronchitis",
        medicines: ["Acetaminophen - For Pain",
            "Guaifenesin - For Cough",
            "Ibuprofen - For Fever"
        ],
        doctor: 2,
        description: "Bronchitis is a viral infection that affects air getting to the lungs. Treatments only soothe the symptoms which will last a few weeks."
    },
    "default": {
        disease_name: "unknown",
        medicines: [],
        doctor: 0, //0 = no, 1 = potential, 2 = definitely
        description: "Sorry, we don't know anything about this disease. Please report this error to bradford.r@husky.neu.edu"
    }
}

module.exports = {
    filter_disease_name: filter_disease_name,
    disease_information: disease_information,
    symptom_info: symptom_info
}