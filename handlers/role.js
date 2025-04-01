
// Role action handlers
const { displaySuccess, displayError } = require('../utils/display');
const rolePrompts = require('../prompts/role');
const { viewRoles } = require('../queries/role');

// Role handlers
const handleViewRoles = async () => {
    try {
        const roles = await viewRoles();
        console.table(roles);
    } catch (error) {
        displayError(`Error viewing roles: ${error.message}`);
    }
};

const handleAddRole = async () => {
    await rolePrompts.addRolePrompt();
};

const handleDeleteRole = async () => {
    await rolePrompts.deleteRolePrompt();
};

module.exports = {
    viewRoles: handleViewRoles,
    addRole: handleAddRole,
    deleteRole: handleDeleteRole
};