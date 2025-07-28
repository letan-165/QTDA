CREATE TABLE User (
    userID VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(50)
);

CREATE TABLE Student (
    studentID VARCHAR(50) PRIMARY KEY,
    class_name VARCHAR(100),
    major VARCHAR(100),
    FOREIGN KEY (studentID) REFERENCES User(userID)
);

CREATE TABLE Employee (
    employeeID VARCHAR(50) PRIMARY KEY,
    department VARCHAR(100),
    FOREIGN KEY (employeeID) REFERENCES User(userID)
);


CREATE TABLE Support (
    supportID VARCHAR(50) PRIMARY KEY,
    studentID VARCHAR(50),
    type VARCHAR(50),
    status VARCHAR(50),
    title VARCHAR(255),
    created_at DATE,
    content TEXT,
    FOREIGN KEY (studentID) REFERENCES Student(studentID)
);

CREATE TABLE Response (
    responseID VARCHAR(50),
    supportID VARCHAR(50),
    employeeID VARCHAR(50),
    title VARCHAR(255),
    created_at DATE,
    content TEXT,
    PRIMARY KEY (responseID),
    FOREIGN KEY (supportID) REFERENCES Support(supportID),
    FOREIGN KEY (employeeID) REFERENCES Employee(employeeID)
);

CREATE TABLE Notification (
    notificationID VARCHAR(50) PRIMARY KEY,
    sAffairsID VARCHAR(50),
    title VARCHAR(255),
    created_at DATE,
    content TEXT,
    FOREIGN KEY (sAffairsID) REFERENCES Employee(employeeID)
);

