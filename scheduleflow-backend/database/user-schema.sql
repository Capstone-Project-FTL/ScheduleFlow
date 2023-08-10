CREATE TABLE users(
    id SERIAL NOT NULL,
    email varchar(255) NOT NULL UNIQUE CHECK (POSITION('@' IN email) > 1),
    password varchar(255) NOT NULL,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    school varchar(255) NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp,
    PRIMARY KEY(id) 
);