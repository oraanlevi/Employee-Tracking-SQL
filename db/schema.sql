DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;
USE employees;

CREATE TABLE department (
    id INIT PRIMARY KEY AUTO_INCREMENT.
    deaprtment_name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INIT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT 

);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VRACHAR(30) NOT NULL
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT

);

