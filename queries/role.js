const db = require("../db");

// View all roles
const viewRoles = async () => {
    const { rows } = await db.query(
        `SELECT role.id, role.title, role.salary, department.name AS department
         FROM role
         JOIN department ON role.department_id = department.id;`
    );
    return rows;
};

// Add a new role
const addRole = async (title, salary, departmentId) => {
    await db.query(
        "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
        [title, salary, departmentId]
    );
    return `Role "${title}" added successfully!`;
};


// Add to queries/role.js
const deleteRole = async (id) => {
    await db.query("DELETE FROM role WHERE id = $1", [id]);
    return `Role deleted successfully!`;
};



module.exports = { viewRoles, addRole, deleteRole };