DROP TABLE IF EXISTS DISEASE_SYMPTOM;
DROP TABLE IF EXISTS DISEASE;
DROP TABLE IF EXISTS BUSUSER;
DROP TABLE IF EXISTS USER;
DROP TABLE IF EXISTS SYMPTOM;


-- The users table that stores all the information for a user
-- USERNAME is unique
CREATE TABLE USER (
    deviceID VARCHAR(200),
    latitude VARCHAR(200),
    longitude VARCHAR(200),
    username VARCHAR(200),
    password VARCHAR(200),
    salt VARCHAR(200),
    date_reg DATE,
    dob DATE,
    gender VARCHAR(20),
    weight VARCHAR(5),
    height VARCHAR(5),
    does_smoke BOOLEAN,
    has_hypertension BOOLEAN,
    has_diabetes BOOLEAN,
    has_high_cholesterol BOOLEAN,
    PRIMARY KEY (username)
);

-- Stores the information for a disease point
-- References the user table to get the location of the user 
-- Who is sick
-- Has an artificially generated primary key that is just
-- An incremented number
CREATE TABLE DISEASE (
    date DATE,
    disease_name VARCHAR(200),
    date_healthy DATE,
    username VARCHAR(200),
    id INTEGER NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(id),
    FOREIGN KEY (username) REFERENCES USER(username)
);

-- The table that maps symID to its description
-- NOT CHANGED other than the following insert statements
CREATE TABLE SYMPTOM (
    symID INTEGER,
    description VARCHAR(10000),
    PRIMARY KEY (symID)
);

INSERT INTO SYMPTOM VALUES (0, "No Symptoms");
INSERT INTO SYMPTOM VALUES (1, "I have a runny nose");
INSERT INTO SYMPTOM VALUES (2, "I have a fever");
INSERT INTO SYMPTOM VALUES (3,"My eyes are watering");
INSERT INTO SYMPTOM VALUES (4,"I am sneezing a lot");
INSERT INTO SYMPTOM VALUES (5,"I have a headache");
INSERT INTO SYMPTOM VALUES (6, "I have chills");
INSERT INTO SYMPTOM VALUES (7, "I am fatigued");
INSERT INTO SYMPTOM VALUES (8, "I am congested");
INSERT INTO SYMPTOM VALUES (9, "I have vomited today");
INSERT INTO SYMPTOM VALUES (10, "I have diarrhea");
INSERT INTO SYMPTOM VALUES (11, "I am nauseous");
INSERT INTO SYMPTOM VALUES (12, "I have cramps");
INSERT INTO SYMPTOM VALUES (13, "I have swelling");
INSERT INTO SYMPTOM VALUES (14, "I am feeling very itchy");
INSERT INTO SYMPTOM VALUES (15, "I have a rash");
INSERT INTO SYMPTOM VALUES (16, "I have blisters");
INSERT INTO SYMPTOM VALUES (17, "I have a sore throat");
INSERT INTO SYMPTOM VALUES (18, "I am aching all over");
INSERT INTO SYMPTOM VALUES (19, "I have a bull's eye rash");
INSERT INTO SYMPTOM VALUES (20, "I have a cough");
INSERT INTO SYMPTOM VALUES (21, "I am sweating at night");
INSERT INTO SYMPTOM VALUES (22, "I am not hungry");
INSERT INTO SYMPTOM VALUES (23, "My eyes are itchy");
INSERT INTO SYMPTOM VALUES (24, "My eyes are red");
INSERT INTO SYMPTOM VALUES (25, "I have discharge");
INSERT INTO SYMPTOM VALUES (26, "My eyes are swelling");
INSERT INTO SYMPTOM VALUES (27, "I have mouth sores");

-- Stores which diseaseID has which symptioms
CREATE TABLE DISEASE_SYMPTOM (
    diseaseID INTEGER,
    symID INTEGER,
    PRIMARY KEY (diseaseID, symID),
    FOREIGN KEY (diseaseID) REFERENCES DISEASE(id),
    FOREIGN KEY (symID) REFERENCES SYMPTOM(symID)
);