// Export all prompt modules
const departmentPrompts = require('./department');
const rolePrompts = require('./role');
const employeePrompts = require('./employee');

module.exports = {
    ...departmentPrompts,
    ...rolePrompts,
    ...employeePrompts
};