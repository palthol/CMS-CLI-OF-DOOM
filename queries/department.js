const db = require("../db");

// View all departments
const viewDepartments = async () => {
  const { rows } = await db.query("SELECT * FROM department");
  return rows;
};

// Add a new department
const addDepartment = async (name) => {
  await db.query("INSERT INTO department (name) VALUES ($1)", [name]);
  return `Department "${name}" added successfully!`;
};

const deleteDepartment = async (id) => {
  await db.query("DELETE FROM department WHERE id = $1", [id]);
  return `Department deleted successfully!`;
};


const viewDepartmentBudget = async (departmentId) => {
  const { rows } = await db.query(
      `SELECT 
          d.name AS department,
          SUM(r.salary) AS total_budget
       FROM employee e
       JOIN role r ON e.role_id = r.id
       JOIN department d ON r.department_id = d.id
       WHERE d.id = $1
       GROUP BY d.name;`,
      [departmentId]
  );
  return rows[0];
};


module.exports = { viewDepartments, addDepartment, deleteDepartment, viewDepartmentBudget };
