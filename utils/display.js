const chalk = require("chalk");

// Display utility functions
const displaySuccess = message => console.log(chalk.green(`✅ ${message}`));
const displayError = message => console.log(chalk.red(`❌ ${message}`));
const displayInfo = message => console.log(chalk.blue(`ℹ️ ${message}`));
const displayWarning = message => console.log(chalk.yellow(`⚠️ ${message}`));

module.exports = { 
    displaySuccess, 
    displayError, 
    displayInfo, 
    displayWarning,
    // Constants
    VIEW_COLOR: chalk.cyan,
    ADD_COLOR: chalk.green,
    UPDATE_COLOR: chalk.yellow,
    DELETE_COLOR: chalk.red,
    SYSTEM_COLOR: chalk.magenta
};