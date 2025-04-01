// Main action router
const inquirer = require('inquirer');
const { getMenuChoices } = require('../utils/menu');
const { displaySuccess, displayError } = require('../utils/display');
const db = require('../db/connection');

const departmentHandlers = require('./department');
const roleHandlers = require('./role');
const employeeHandlers = require('./employee');

// Action mapping for cleaner routing
const actionHandlers = {
    // Department actions
    'viewDepartments': departmentHandlers.viewDepartments,
    'addDepartment': departmentHandlers.addDepartment,
    'deleteDepartment': departmentHandlers.deleteDepartment,
    'viewBudget': departmentHandlers.viewBudget,
    
    // Role actions
    'viewRoles': roleHandlers.viewRoles,
    'addRole': roleHandlers.addRole,
    'deleteRole': roleHandlers.deleteRole,
    
    // Employee actions
    'viewEmployees': employeeHandlers.viewEmployees,
    'viewByManager': employeeHandlers.viewByManager,
    'viewByDepartment': employeeHandlers.viewByDepartment,
    'addEmployee': employeeHandlers.addEmployee,
    'deleteEmployee': employeeHandlers.deleteEmployee,
    'updateRole': employeeHandlers.updateRole,
    'updateManager': employeeHandlers.updateManager
};

const mainMenu = async () => {
    try {
        const { action } = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "Choose an action:",
                choices: getMenuChoices()
            },
        ]);
        
        if (action === 'exit') {
            displaySuccess("Goodbye!");
            await db.end();
            process.exit(0);
        }
        
        const handler = actionHandlers[action];
        if (handler) {
            await handler();
        } else {
            displayError(`No handler found for action: ${action}`);
        }
        
        // Return to main menu
        await mainMenu();
    } catch (error) {
        displayError(`An error occurred: ${error.message}`);
        await mainMenu();
    }
};

module.exports = { mainMenu };