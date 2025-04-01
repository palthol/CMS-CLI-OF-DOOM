-- drop existing tables to start fresh. (order matters due to foreign keys)

DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

-- Create the department table

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Create the role table with foreign key to department
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary NUMERIC NOT NULL,
    department_id INTEGER REFERENCES department(id)
);

-- Create the employee table with the self-reference for easy managment.

CREATE TABLE employee (

    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER REFERENCES role(id),
    manager_id INTEGER REFERENCES employee(id)
);

-- Seed departments

INSERT INTO department (name)
VALUES
('Engineering'),
('Sales'),
('HR');

-- Seed roles

INSERT INTO role (title, salary, department_id)
VALUES
('Software Engineer', 90000, 1),
('Sales Manager', 80000, 2),
('HR Manager', 70000, 3);

--  Seed employees

-- Null manager_id for top-level managers.

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Jane', 'Doe', 1, NULL),
('John', 'Smith', 2, NULL),
('Emily', 'Jones', 3, NULL);