const db = require('../db/connection');

// View all roles
const viewRoles = async () => {
    const { rows } = await db.query(
        `SELECT r.id, r.title, r.salary, d.name AS department
         FROM role r
         LEFT JOIN department d ON r.department_id = d.id
         ORDER BY r.title`
    );
    return rows;
};

// Add a role
const addRole = async (title, salary, departmentId) => {
    const { rows } = await db.query(
        `INSERT INTO role (title, salary, department_id) 
         VALUES ($1, $2, $3) 
         RETURNING id`,
        [title, salary, departmentId]
    );
    return `Role '${title}' added successfully!`;
};

// Delete a role
const deleteRole = async (id) => {
    await db.query('DELETE FROM role WHERE id = $1', [id]);
    return `Role deleted successfully!`;
};

module.exports = {
    viewRoles,
    addRole,
    deleteRole
};