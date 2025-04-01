const inquirer = require("inquirer");
const chalk = require("chalk");

// Colors for menu items
const VIEW_COLOR = chalk.cyan;
const ADD_COLOR = chalk.green;
const UPDATE_COLOR = chalk.yellow;
const DELETE_COLOR = chalk.red;
const SYSTEM_COLOR = chalk.magenta;

// Icons for actions
const VIEW_ICON = "[VIEW] ";
const ADD_ICON = "[ADD] ";
const UPDATE_ICON = "[UPD] ";
const DELETE_ICON = "[DEL] ";
const EXIT_ICON = "[EXIT] ";

// Menu structure definition
const menuOptions = [
    { type: 'separator', text: chalk.cyan.bold("┌─────────── VIEW DATA ───────────┐") },
    { id: 'viewDepartments', display: VIEW_COLOR(VIEW_ICON + "View All Departments") },
    // Rest of the menu items...
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
    VIEW_COLOR,
    ADD_COLOR,
    UPDATE_COLOR,
    DELETE_COLOR,
    SYSTEM_COLOR,
    VIEW_ICON,
    ADD_ICON,
    UPDATE_ICON,
    DELETE_ICON,
    EXIT_ICON
};