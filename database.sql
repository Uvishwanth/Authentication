CREATE DATABASE USER_AUTHENTICATION;
CREATE TABLE user(
    firstname varchar(250) NOT NULL,
    lastname varchar(250) NOT NULL,
    email varchar(250) NOT NULL,
    password varchar(250) NOT NULL,
    confirm varchar(250) NOT NULL   
);