function filter_disease_name(req, res, next) {
    req.params.diseaseID = req.params.diseaseID.replace(/-/g, " ");
    next();
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
    "default": {
        disease_name: "unknown",
        medicines: [],
        doctor: 0, //0 = no, 1 = potential, 2 = definitely
        description: "Sorry, we don't know anything about this disease. Please report this error to bradford.r@husky.neu.edu"
    }
}

module.exports = {
    filter_disease_name: filter_disease_name,
    disease_information: disease_information
}