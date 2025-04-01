// Employee action handlers
const { displaySuccess, displayError } = require('../utils/display');
const employeePrompts = require('../prompts/employee');
const { viewEmployees } = require('../queries/employee');

// Employee handlers
const handleViewEmployees = async () => {
    try {
        const employees = await viewEmployees();
        console.table(employees);
    } catch (error) {
        displayError(`Error viewing employees: ${error.message}`);
    }
};

const handleViewByManager = async () => {
    await employeePrompts.viewEmployeesByManagerPrompt();
};

const handleViewByDepartment = async () => {
    await employeePrompts.viewEmployeesByDepartmentPrompt();
};

const handleAddEmployee = async () => {
    await employeePrompts.addEmployeePrompt();
};

const handleDeleteEmployee = async () => {
    await employeePrompts.deleteEmployeePrompt();
};

const handleUpdateRole = async () => {
    await employeePrompts.updateEmployeeRolePrompt();
};

const handleUpdateManager = async () => {
    await employeePrompts.updateEmployeeManagerPrompt();
};

module.exports = {
    viewEmployees: handleViewEmployees,
    viewByManager: handleViewByManager,
    viewByDepartment: handleViewByDepartment,
    addEmployee: handleAddEmployee,
    deleteEmployee: handleDeleteEmployee,
    updateRole: handleUpdateRole,
    updateManager: handleUpdateManager
};