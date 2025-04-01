// Colored output functions
const chalk = require('chalk');

// Display utility functions
const displaySuccess = message => console.log(chalk.green(`✓ ${message}`));
const displayError = message => console.log(chalk.red(`✗ ${message}`));
const displayWarning = message => console.log(chalk.yellow(`! ${message}`));
const displayInfo = message => console.log(chalk.blue(`ℹ ${message}`));

// Style constants
const VIEW_COLOR = chalk.cyan;
const ADD_COLOR = chalk.green;
const UPDATE_COLOR = chalk.yellow;
const DELETE_COLOR = chalk.red;
const SYSTEM_COLOR = chalk.magenta;

module.exports = {
    displaySuccess,
    displayError,
    displayWarning,
    displayInfo,
    VIEW_COLOR,
    ADD_COLOR,
    UPDATE_COLOR,
    DELETE_COLOR,
    SYSTEM_COLOR
};