const inquirer = require('inquirer');
const { displaySuccess, displayError, displayWarning } = require('../utils/display');
const { addRole, viewRoles, deleteRole } = require('../queries/role');
const { viewDepartments } = require('../queries/department');

// Role prompts
const addRolePrompt = async () => {
    const departments = await viewDepartments();
    
    if (departments.length === 0) {
        displayWarning("No departments available. Please create a department first.");
        return;
    }
    
    const roleDetails = await inquirer.prompt([
        { 
            type: "input", 
            name: "title", 
            message: "Enter role title:",
            validate: input => input ? true : "Role title cannot be empty!"
        },
        { 
            type: "input", 
            name: "salary", 
            message: "Enter role salary:",
            validate: input => !isNaN(input) || "Enter a valid number!" 
        },
        { 
            type: "list", 
            name: "departmentId", 
            message: "Select department:",
            choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
        },
    ]);
    
    try {
        const result = await addRole(
            roleDetails.title,
            parseFloat(roleDetails.salary), 
            parseInt(roleDetails.departmentId)
        );
        displaySuccess(`Role "${roleDetails.title}" added successfully!`);
        return result;
    } catch (error) {
        displayError(`Could not add role: ${error.message}`);
    }
};

const deleteRolePrompt = async () => {
    const roles = await viewRoles();
    
    if (roles.length === 0) {
        displayWarning("No roles available to delete.");
        return;
    }
    
    const { roleId, confirmDelete } = await inquirer.prompt([
        { 
            type: "list", 
            name: "roleId", 
            message: "Select role to delete:",
            choices: roles.map(role => ({ 
                name: `${role.title} (${role.department || 'No Department'})`, 
                value: role.id 
            }))
        },
        {
            type: "confirm",
            name: "confirmDelete",
            message: "WARNING: This will delete all employees with this role! Are you sure?",
            default: false
        }
    ]);
    
    if (confirmDelete) {
        try {
            const result = await deleteRole(roleId);
            displaySuccess("Role deleted successfully!");
            return result;
        } catch (error) {
            displayError("Cannot delete role with associated employees. Update or delete those employees first.");
        }
    } else {
        displayWarning("Deletion cancelled.");
    }
};

module.exports = {
    addRolePrompt,
    deleteRolePrompt
};