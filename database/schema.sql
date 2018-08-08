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

-- Stores which diseaseID has which symptioms
CREATE TABLE DISEASE_SYMPTOM (
    diseaseID INTEGER,
    symID INTEGER,
    PRIMARY KEY (diseaseID, symID),
    FOREIGN KEY (diseaseID) REFERENCES DISEASE(id)
);