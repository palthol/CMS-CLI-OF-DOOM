const db = require("../db");

// View all employees
const viewEmployees = async () => {
    const { rows } = await db.query(
        `SELECT 
            e.id, 
            e.first_name, 
            e.last_name, 
            r.title AS job_title, 
            d.name AS department, 
            r.salary, 
            CONCAT(m.first_name, ' ', m.last_name) AS manager
         FROM employee e
         LEFT JOIN employee m ON e.manager_id = m.id
         JOIN role r ON e.role_id = r.id
         JOIN department d ON r.department_id = d.id;`
    );
    return rows;
};

// Rest of the file remains the same

// Add a new employee
const addEmployee = async (firstName, lastName, roleId, managerId) => {
    await db.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
        [firstName, lastName, roleId, managerId]
    );
    return `Employee "${firstName} ${lastName}" added successfully!`;
};

// Update an employee role
const updateEmployeeRole = async (employeeId, newRoleId) => {
    await db.query(
        "UPDATE employee SET role_id = $1 WHERE id = $2",
        [newRoleId, employeeId]
    );
    return `Employee ID ${employeeId} updated to role ID ${newRoleId}.`;
};

const updateEmployeeManager = async (employeeId, newManagerId) => {
    await db.query(
        "UPDATE employee SET manager_id = $1 WHERE id = $2",
        [newManagerId, employeeId]
    );
    return `Employee's manager updated successfully!`;
};


const viewEmployeesByManager = async (managerId) => {
    const { rows } = await db.query(
        `SELECT 
            e.id, 
            e.first_name, 
            e.last_name, 
            r.title AS job_title, 
            d.name AS department, 
            r.salary
         FROM employee e
         JOIN role r ON e.role_id = r.id
         JOIN department d ON r.department_id = d.id
         WHERE e.manager_id = $1;`,
        [managerId]
    );
    return rows;
};


const viewEmployeesByDepartment = async (departmentId) => {
    const { rows } = await db.query(
        `SELECT 
            e.id, 
            e.first_name, 
            e.last_name, 
            r.title AS job_title, 
            r.salary, 
            CONCAT(m.first_name, ' ', m.last_name) AS manager
         FROM employee e
         LEFT JOIN employee m ON e.manager_id = m.id
         JOIN role r ON e.role_id = r.id
         WHERE r.department_id = $1;`,
        [departmentId]
    );
    return rows;
};

const deleteEmployee = async (id) => {
    await db.query("DELETE FROM employee WHERE id = $1", [id]);
    return `Employee deleted successfully!`;
};



module.exports = { viewEmployees, addEmployee, updateEmployeeRole, updateEmployeeManager, viewEmployeesByManager, viewEmployeesByDepartment, deleteEmployee };
