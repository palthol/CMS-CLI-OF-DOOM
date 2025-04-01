const inquirer = require('inquirer');
const { displaySuccess, displayError, displayWarning } = require('../utils/display');
const { viewEmployees, addEmployee, deleteEmployee, updateEmployeeRole, updateEmployeeManager, viewEmployeesByManager, viewEmployeesByDepartment } = require('../queries/employee');
const { viewRoles } = require('../queries/role');
const { viewDepartments } = require('../queries/department');
const db = require('../db/connection');

// Employee prompts
const viewEmployeesByManagerPrompt = async () => {
    // Get all managers (employees who are managers)
    const { rows: managers } = await db.query(
        `SELECT DISTINCT m.id, m.first_name, m.last_name 
         FROM employee e 
         JOIN employee m ON e.manager_id = m.id 
         ORDER BY m.last_name, m.first_name`
    );
    
    if (managers.length === 0) {
        displayWarning("No managers found in the system.");
        return;
    }
    
    const { managerId } = await inquirer.prompt([
        {
            type: "list",
            name: "managerId",
            message: "Select a manager to view their employees:",
            choices: managers.map(mgr => ({ 
                name: `${mgr.first_name} ${mgr.last_name}`, 
                value: mgr.id 
            }))
        }
    ]);
    
    try {
        const employees = await viewEmployeesByManager(managerId);
        
        if (employees.length === 0) {
            displayWarning("No employees found for this manager.");
        } else {
            console.table(employees);
        }
        return employees;
    } catch (error) {
        displayError(`Error: ${error.message}`);
    }
};

const viewEmployeesByDepartmentPrompt = async () => {
    const departments = await viewDepartments();
    
    if (departments.length === 0) {
        displayWarning("No departments available.");
        return;
    }
    
    const { departmentId } = await inquirer.prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Select a department:",
            choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
        }
    ]);
    
    try {
        const employees = await viewEmployeesByDepartment(departmentId);
        
        if (employees.length === 0) {
            displayWarning("No employees found in this department.");
        } else {
            console.table(employees);
        }
        return employees;
    } catch (error) {
        displayError(`Error: ${error.message}`);
    }
};

const addEmployeePrompt = async () => {
    // Get roles for selection
    const roles = await viewRoles();
    
    if (roles.length === 0) {
        displayWarning("No roles available. Please create a role first.");
        return;
    }
    
    // Get employees for manager selection
    const employees = await viewEmployees();
    
    const employeeDetails = await inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Enter employee's first name:",
            validate: input => input ? true : "First name cannot be empty!"
        },
        {
            type: "input",
            name: "lastName",
            message: "Enter employee's last name:",
            validate: input => input ? true : "Last name cannot be empty!"
        },
        {
            type: "list",
            name: "roleId",
            message: "Select employee's role:",
            choices: roles.map(role => ({ 
                name: `${role.title} (${role.department || 'No Department'})`, 
                value: role.id 
            }))
        },
        {
            type: "list",
            name: "managerId",
            message: "Select employee's manager:",
            choices: [
                { name: "None", value: null },
                ...employees.map(emp => ({ 
                    name: `${emp.first_name} ${emp.last_name}`, 
                    value: emp.id 
                }))
            ]
        }
    ]);
    
    try {
        const result = await addEmployee(
            employeeDetails.firstName,
            employeeDetails.lastName,
            employeeDetails.roleId,
            employeeDetails.managerId
        );
        displaySuccess(`Employee ${employeeDetails.firstName} ${employeeDetails.lastName} added successfully!`);
        return result;
    } catch (error) {
        displayError(`Could not add employee: ${error.message}`);
    }
};

const deleteEmployeePrompt = async () => {
    const employees = await viewEmployees();
    
    if (employees.length === 0) {
        displayWarning("No employees available to delete.");
        return;
    }
    
    const { employeeId, confirmDelete } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Select employee to delete:",
            choices: employees.map(emp => ({ 
                name: `${emp.first_name} ${emp.last_name} - ${emp.job_title || 'No Role'}`, 
                value: emp.id 
            }))
        },
        {
            type: "confirm",
            name: "confirmDelete",
            message: "Are you sure you want to delete this employee? This cannot be undone.",
            default: false
        }
    ]);
    
    if (confirmDelete) {
        try {
            const result = await deleteEmployee(employeeId);
            displaySuccess("Employee deleted successfully!");
            return result;
        } catch (error) {
            displayError("Cannot delete employee. They may be assigned as a manager to others.");
        }
    } else {
        displayWarning("Deletion cancelled.");
    }
};

const updateEmployeeRolePrompt = async () => {
    const employees = await viewEmployees();
    const roles = await viewRoles();
    
    if (employees.length === 0) {
        displayWarning("No employees available to update.");
        return;
    }
    
    if (roles.length === 0) {
        displayWarning("No roles available. Please create a role first.");
        return;
    }
    
    const { employeeId, roleId } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Select employee to update:",
            choices: employees.map(emp => ({ 
                name: `${emp.first_name} ${emp.last_name} - ${emp.job_title || 'No Role'}`, 
                value: emp.id 
            }))
        },
        {
            type: "list",
            name: "roleId",
            message: "Select new role:",
            choices: roles.map(role => ({ 
                name: `${role.title} (${role.department || 'No Department'})`, 
                value: role.id 
            }))
        }
    ]);
    
    try {
        const result = await updateEmployeeRole(employeeId, roleId);
        displaySuccess("Employee role updated successfully!");
        return result;
    } catch (error) {
        displayError(`Error updating employee role: ${error.message}`);
    }
};

const updateEmployeeManagerPrompt = async () => {
    const employees = await viewEmployees();
    
    if (employees.length === 0) {
        displayWarning("No employees available to update.");
        return;
    }
    
    const { employeeId } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Select employee to update:",
            choices: employees.map(emp => ({ 
                name: `${emp.first_name} ${emp.last_name}`, 
                value: emp.id 
            }))
        }
    ]);
    
    const { managerId } = await inquirer.prompt([
        {
            type: "list",
            name: "managerId",
            message: "Select new manager:",
            choices: [
                { name: "None", value: null },
                ...employees
                    .filter(emp => emp.id !== parseInt(employeeId)) // Can't be own manager
                    .map(emp => ({ 
                        name: `${emp.first_name} ${emp.last_name}`, 
                        value: emp.id 
                    }))
            ]
        }
    ]);
    
    try {
        const result = await updateEmployeeManager(employeeId, managerId);
        displaySuccess("Employee manager updated successfully!");
        return result;
    } catch (error) {
        displayError(`Error updating employee manager: ${error.message}`);
    }
};

module.exports = {
    viewEmployeesByManagerPrompt,
    viewEmployeesByDepartmentPrompt,
    addEmployeePrompt,
    deleteEmployeePrompt,
    updateEmployeeRolePrompt,
    updateEmployeeManagerPrompt
};