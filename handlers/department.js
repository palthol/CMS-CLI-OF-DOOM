// Department action handlers
const { displaySuccess, displayError } = require('../utils/display');
const departmentPrompts = require('../prompts/department');
const { viewDepartments } = require('../queries/department');

// Department handlers
const handleViewDepartments = async () => {
    try {
        const departments = await viewDepartments();
        console.table(departments);
    } catch (error) {
        displayError(`Error viewing departments: ${error.message}`);
    }
};

const handleAddDepartment = async () => {
    await departmentPrompts.addDepartmentPrompt();
};

const handleDeleteDepartment = async () => {
    await departmentPrompts.deleteDepartmentPrompt();
};

const handleViewBudget = async () => {
    await departmentPrompts.viewDepartmentBudgetPrompt();
};

module.exports = {
    viewDepartments: handleViewDepartments,
    addDepartment: handleAddDepartment,
    deleteDepartment: handleDeleteDepartment,
    viewBudget: handleViewBudget
};