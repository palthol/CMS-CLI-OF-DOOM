const db = require('../db/connection');

// View all departments
const viewDepartments = async () => {
    const { rows } = await db.query(
        'SELECT id, name FROM department ORDER BY name'
    );
    return rows;
};

// Add a department
const addDepartment = async (name) => {
    const { rows } = await db.query(
        'INSERT INTO department (name) VALUES ($1) RETURNING id, name',
        [name]
    );
    return `Department '${name}' added successfully!`;
};

// Delete a department
const deleteDepartment = async (id) => {
    await db.query('DELETE FROM department WHERE id = $1', [id]);
    return `Department deleted successfully!`;
};

// View department budget
const viewDepartmentBudget = async (departmentId) => {
    const { rows } = await db.query(
        `SELECT d.name AS department, 
        COALESCE(SUM(r.salary), 0) AS total_budget
        FROM department d
        LEFT JOIN role r ON d.id = r.department_id
        LEFT JOIN employee e ON r.id = e.role_id
        WHERE d.id = $1
        GROUP BY d.name`,
        [departmentId]
    );
    return rows[0];
};

module.exports = {
    viewDepartments,
    addDepartment,
    deleteDepartment,
    viewDepartmentBudget
};