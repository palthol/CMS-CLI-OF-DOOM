const db = require('../db/connection');

// View all employees
const viewEmployees = async () => {
    const { rows } = await db.query(
        `SELECT e.id, e.first_name, e.last_name, 
         r.title AS job_title, d.name AS department,
         r.salary, 
         CONCAT(m.first_name, ' ', m.last_name) AS manager
         FROM employee e
         LEFT JOIN role r ON e.role_id = r.id
         LEFT JOIN department d ON r.department_id = d.id
         LEFT JOIN employee m ON e.manager_id = m.id
         ORDER BY e.last_name, e.first_name`
    );
    return rows;
};

// View employees by manager
const viewEmployeesByManager = async (managerId) => {
    const { rows } = await db.query(
        `SELECT e.id, e.first_name, e.last_name, 
         r.title AS job_title, d.name AS department
         FROM employee e
         LEFT JOIN role r ON e.role_id = r.id
         LEFT JOIN department d ON r.department_id = d.id
         WHERE e.manager_id = $1
         ORDER BY e.last_name, e.first_name`,
        [managerId]
    );
    return rows;
};

// View employees by department
const viewEmployeesByDepartment = async (departmentId) => {
    const { rows } = await db.query(
        `SELECT e.id, e.first_name, e.last_name, 
         r.title AS job_title,
         CONCAT(m.first_name, ' ', m.last_name) AS manager
         FROM employee e
         LEFT JOIN role r ON e.role_id = r.id
         LEFT JOIN employee m ON e.manager_id = m.id
         WHERE r.department_id = $1
         ORDER BY e.last_name, e.first_name`,
        [departmentId]
    );
    return rows;
};

// Add an employee
const addEmployee = async (firstName, lastName, roleId, managerId) => {
    const { rows } = await db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [firstName, lastName, roleId, managerId]
    );
    return `Employee ${firstName} ${lastName} added successfully!`;
};

// Delete an employee
const deleteEmployee = async (id) => {
    await db.query('DELETE FROM employee WHERE id = $1', [id]);
    return `Employee deleted successfully!`;
};

// Update employee role
const updateEmployeeRole = async (employeeId, roleId) => {
    await db.query(
        'UPDATE employee SET role_id = $1 WHERE id = $2',
        [roleId, employeeId]
    );
    return `Employee role updated successfully!`;
};

// Update employee manager
const updateEmployeeManager = async (employeeId, managerId) => {
    await db.query(
        'UPDATE employee SET manager_id = $1 WHERE id = $2',
        [managerId, employeeId]
    );
    return `Employee manager updated successfully!`;
};

module.exports = {
    viewEmployees,
    viewEmployeesByManager,
    viewEmployeesByDepartment,
    addEmployee,
    deleteEmployee,
    updateEmployeeRole,
    updateEmployeeManager
};