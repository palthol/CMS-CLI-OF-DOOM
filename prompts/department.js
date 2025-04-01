const inquirer = require('inquirer');
const { displaySuccess, displayError, displayWarning } = require('../utils/display');
const { viewDepartments, addDepartment, deleteDepartment, viewDepartmentBudget } = require('../queries/department');

// Department prompts
const addDepartmentPrompt = async () => {
    const { departmentName } = await inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "Enter department name:",
            validate: input => input ? true : "Department name cannot be empty!",
        },
    ]);
    
    try {
        const result = await addDepartment(departmentName);
        displaySuccess(`Department "${departmentName}" added successfully!`);
        return result;
    } catch (error) {
        displayError(`Could not add department: ${error.message}`);
    }
};

const deleteDepartmentPrompt = async () => {
    const departments = await viewDepartments();
    
    if (departments.length === 0) {
        displayWarning("No departments available to delete.");
        return;
    }
    
    const { departmentId, confirmDelete } = await inquirer.prompt([
        { 
            type: "list", 
            name: "departmentId", 
            message: "Select department to delete:",
            choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
        },
        {
            type: "confirm",
            name: "confirmDelete",
            message: "WARNING: This will delete all roles and employees in this department! Are you sure?",
            default: false
        }
    ]);
    
    if (confirmDelete) {
        try {
            const result = await deleteDepartment(departmentId);
            displaySuccess("Department deleted successfully!");
            return result;
        } catch (error) {
            displayError("Cannot delete department with associated roles. Delete those roles first.");
        }
    } else {
        displayWarning("Deletion cancelled.");
    }
};

const viewDepartmentBudgetPrompt = async () => {
    const departments = await viewDepartments();
    
    if (departments.length === 0) {
        displayWarning("No departments available.");
        return;
    }
    
    const { departmentId } = await inquirer.prompt([
        { 
            type: "list", 
            name: "departmentId", 
            message: "Select department:",
            choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
        }
    ]);
    
    try {
        const budget = await viewDepartmentBudget(departmentId);
        if (!budget) {
            displayWarning("No salary data found for this department.");
        } else {
            displaySuccess(`Total budget for ${budget.department}: $${budget.total_budget.toLocaleString()}`);
        }
        return budget;
    } catch (error) {
        displayError(`Error retrieving budget: ${error.message}`);
    }
};

module.exports = {
    addDepartmentPrompt,
    deleteDepartmentPrompt,
    viewDepartmentBudgetPrompt
};