USE delta_app;



CREATE TABLE user (
    id VARCHAR(30) PRIMARY KEY,
    username VARCHAR(30) UNIQUE,
    email VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(30) NOT NULL

);
