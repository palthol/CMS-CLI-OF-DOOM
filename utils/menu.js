// Menu structure and styling
const inquirer = require('inquirer');
const chalk = require('chalk');

// Icons for actions
const VIEW_ICON = "[VIEW] ";
const ADD_ICON = "[ADD] ";
const UPDATE_ICON = "[UPD] ";
const DELETE_ICON = "[DEL] ";
const EXIT_ICON = "[EXIT] ";

// Colors
const { VIEW_COLOR, ADD_COLOR, UPDATE_COLOR, DELETE_COLOR, SYSTEM_COLOR } = require('../utils/display');

// Menu structure definition
const menuOptions = [
    { type: 'separator', text: chalk.cyan.bold("┌─────────── VIEW DATA ───────────┐") },
    { id: 'viewDepartments', display: VIEW_COLOR(VIEW_ICON + "View All Departments") },
    { id: 'viewRoles', display: VIEW_COLOR(VIEW_ICON + "View All Roles") },
    { id: 'viewEmployees', display: VIEW_COLOR(VIEW_ICON + "View All Employees") },
    { id: 'viewByManager', display: VIEW_COLOR(VIEW_ICON + "View Employees by Manager") },
    { id: 'viewByDepartment', display: VIEW_COLOR(VIEW_ICON + "View Employees by Department") },
    
    { type: 'separator', text: chalk.green.bold("┌────── MANAGE DEPARTMENTS ───────┐") },
    { id: 'addDepartment', display: ADD_COLOR(ADD_ICON + "Add a Department") },
    { id: 'deleteDepartment', display: DELETE_COLOR(DELETE_ICON + "Delete Department") },
    { id: 'viewBudget', display: VIEW_COLOR(VIEW_ICON + "View Department Budget") },
    
    { type: 'separator', text: chalk.yellow.bold("┌─────────── MANAGE ROLES ─────────┐") },
    { id: 'addRole', display: ADD_COLOR(ADD_ICON + "Add a Role") },
    { id: 'deleteRole', display: DELETE_COLOR(DELETE_ICON + "Delete Role") },
    
    { type: 'separator', text: chalk.red.bold("┌────── MANAGE EMPLOYEES ──────────┐") },
    { id: 'addEmployee', display: ADD_COLOR(ADD_ICON + "Add an Employee") },
    { id: 'deleteEmployee', display: DELETE_COLOR(DELETE_ICON + "Delete Employee") },
    { id: 'updateRole', display: UPDATE_COLOR(UPDATE_ICON + "Update Employee Role") },
    { id: 'updateManager', display: UPDATE_COLOR(UPDATE_ICON + "Update Employee Manager") },
    
    { type: 'separator', text: chalk.magenta.bold("┌─────────── SYSTEM ─────────────┐") },
    { id: 'exit', display: SYSTEM_COLOR(EXIT_ICON + "Exit") },
    { type: 'separator', text: chalk.blue.bold("└──────────────────────────────────┘") },
];

// Convert menu options to Inquirer choices
const getMenuChoices = () => {
    return menuOptions.map(option => {
        if (option.type === 'separator') {
            return new inquirer.Separator(option.text);
        }
        return { name: option.display, value: option.id };
    });
};

module.exports = {
    getMenuChoices,
    VIEW_ICON,
    ADD_ICON,
    UPDATE_ICON,
    DELETE_ICON,
    EXIT_ICON
};