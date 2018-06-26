DROP TABLE IF EXISTS DISSYM;
DROP TABLE IF EXISTS DISEASE_POINTS;
DROP TABLE IF EXISTS BUSUSER;
DROP TABLE IF EXISTS USERS;
DROP TABLE IF EXISTS SYMPTOMS;


-- The users table that stores all the information for a user
-- USERNAME is unique
CREATE TABLE USERS (
    deviceID VARCHAR(200),
    latitude VARCHAR(200),
    longitude VARCHAR(200),
    username VARCHAR(200),
    password VARCHAR(200),
    salt VARCHAR(200),
    date_reg DATE,
    dob DATE,
    gender VARCHAR(20),
    PRIMARY KEY (username)
);

-- Stores the join between users and business owners (also users)
-- This table is used to store information for Epidemik Management
-- Every business can employ every employee only once at a given time
CREATE TABLE BUSUSER (
    uName VARCHAR(200),
    bName VARCHAR(200),
    PRIMARY KEY (uName,bName),
    FOREIGN KEY (uName) REFERENCES USERS(username),
    FOREIGN KEY (bName) REFERENCES USERS(username)
);

-- Stores the information for a disease point
-- References the user table to get the location of the user 
-- Who is sick
-- Has an artificially generated primary key that is just
-- An incremented number
CREATE TABLE DISEASE_POINTS (
    date DATE,
    disease_name VARCHAR(200),
    date_healthy DATE,
    username VARCHAR(200),
    id INTEGER NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(id),
    FOREIGN KEY (username) REFERENCES USERS(username)
);

-- The table that maps symID to its description
-- NOT CHANGED other than the following insert statements
CREATE TABLE SYMPTOMS (
    symID INTEGER,
    description VARCHAR(10000),
    PRIMARY KEY (symID)
);

INSERT INTO SYMPTOMS VALUES (0, "No Symptoms");
INSERT INTO SYMPTOMS VALUES (1, "I have a runny nose");
INSERT INTO SYMPTOMS VALUES (2, "I have a fever");
INSERT INTO SYMPTOMS VALUES (3,"My eyes are watering");
INSERT INTO SYMPTOMS VALUES (4,"I am sneezing a lot");
INSERT INTO SYMPTOMS VALUES (5,"I have a headache");
INSERT INTO SYMPTOMS VALUES (6, "I have chills");
INSERT INTO SYMPTOMS VALUES (7, "I am fatigued");
INSERT INTO SYMPTOMS VALUES (8, "I am congested");
INSERT INTO SYMPTOMS VALUES (9, "I have vomited today");
INSERT INTO SYMPTOMS VALUES (10, "I have diarrhea");
INSERT INTO SYMPTOMS VALUES (11, "I am nauseous");
INSERT INTO SYMPTOMS VALUES (12, "I have cramps");
INSERT INTO SYMPTOMS VALUES (13, "I have swelling");
INSERT INTO SYMPTOMS VALUES (14, "I am feeling very itchy");
INSERT INTO SYMPTOMS VALUES (15, "I have a rash");
INSERT INTO SYMPTOMS VALUES (16, "I have blisters");
INSERT INTO SYMPTOMS VALUES (17, "I have a sore throat");
INSERT INTO SYMPTOMS VALUES (18, "I am aching all over");
INSERT INTO SYMPTOMS VALUES (19, "I have a bull's eye rash");
INSERT INTO SYMPTOMS VALUES (20, "I have a cough");
INSERT INTO SYMPTOMS VALUES (21, "I am sweating at night");
INSERT INTO SYMPTOMS VALUES (22, "I am not hungry");
INSERT INTO SYMPTOMS VALUES (23, "My eyes are itchy");
INSERT INTO SYMPTOMS VALUES (24, "My eyes are red");
INSERT INTO SYMPTOMS VALUES (25, "I have discharge");
INSERT INTO SYMPTOMS VALUES (26, "My eyes are swelling");
INSERT INTO SYMPTOMS VALUES (27, "I have mouth sores");

-- Stores which diseaseID has which symptioms
CREATE TABLE DISSYM (
    diseaseID INTEGER,
    symID INTEGER,
    PRIMARY KEY (diseaseID, symID),
    FOREIGN KEY (diseaseID) REFERENCES DISEASE_POINTS(id),
    FOREIGN KEY (symID) REFERENCES SYMPTOMS(symID)
);