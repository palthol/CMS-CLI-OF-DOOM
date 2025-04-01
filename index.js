// inquirer import

const inquirer = require("inquirer");
const chalk = require("chalk");


// function imports from queries folder
const { viewDepartments, addDepartment, deleteDepartment, viewDepartmentBudget } = require("./queries/department");
const { viewRoles, addRole, deleteRole } = require("./queries/role");
const { viewEmployees, addEmployee, updateEmployeeRole, updateEmployeeManager, viewEmployeesByManager, viewEmployeesByDepartment, deleteEmployee } = require("./queries/employee");
const db = require("./db");


// Styled separators and menu items
const VIEW_COLOR = chalk.cyan;
const ADD_COLOR = chalk.green;
const UPDATE_COLOR = chalk.yellow;
const DELETE_COLOR = chalk.red;
const SYSTEM_COLOR = chalk.magenta;

// Icons for actions
const VIEW_ICON = "👁️ ";
const ADD_ICON = "➕ ";
const UPDATE_ICON = "🔄 ";
const DELETE_ICON = "❌ ";
const EXIT_ICON = "🚪 ";


// Menu structure definition - keeps UI separate from logic
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




// HANDLER FUNCTIONS - grouped by category

// Department handlers
const handleDepartmentActions = async (actionId) => {
    switch (actionId) {
        case 'viewDepartments':
            console.table(await viewDepartments());
            break;
        case 'addDepartment':
            await addDepartmentPrompt();
            break;
        case 'deleteDepartment':
            await deleteDepartmentPrompt();
            break;
        case 'viewBudget':
            await viewDepartmentBudgetPrompt();
            break;
    }
};

// Role handlers
const handleRoleActions = async (actionId) => {
    switch (actionId) {
        case 'viewRoles':
            console.table(await viewRoles());
            break;
        case 'addRole':
            await addRolePrompt();
            break;
        case 'deleteRole':
            await deleteRolePrompt();
            break;
    }
};

// Employee handlers
const handleEmployeeActions = async (actionId) => {
    switch (actionId) {
        case 'viewEmployees':
            console.table(await viewEmployees());
            break;
        case 'viewByManager':
            await viewEmployeesByManagerPrompt();
            break;
        case 'viewByDepartment':
            await viewEmployeesByDepartmentPrompt();
            break;
        case 'addEmployee':
            await addEmployeePrompt();
            break;
        case 'deleteEmployee':
            await deleteEmployeePrompt();
            break;
        case 'updateRole':
            await updateEmployeeRolePrompt();
            break;
        case 'updateManager':
            await updateEmployeeManagerPrompt();
            break;
    }
};


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
    console.log(await addDepartment(departmentName));
};

const deleteDepartmentPrompt = async () => {
    const departments = await viewDepartments();
    
    if (departments.length === 0) {
        console.log("No departments available to delete.");
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
            console.log(await deleteDepartment(departmentId));
        } catch (error) {
            console.log("Cannot delete department with associated roles. Delete those roles first.");
            console.error(error.message);
        }
    } else {
        console.log("Deletion cancelled.");
    }
};

const viewDepartmentBudgetPrompt = async () => {
    const departments = await viewDepartments();
    
    const { departmentId } = await inquirer.prompt([
        { 
            type: "list", 
            name: "departmentId", 
            message: "Select department:",
            choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
        }
    ]);
    
    const budget = await viewDepartmentBudget(departmentId);
    if (!budget) {
        console.log("No salary data found for this department.");
    } else {
        console.log(`Total budget for ${budget.department}: $${budget.total_budget.toLocaleString()}`);
    }
};

// Role prompts
const addRolePrompt = async () => {
    const departments = await viewDepartments();
    
    const roleDetails = await inquirer.prompt([
        { type: "input", name: "title", message: "Enter role title:" },
        { type: "input", name: "salary", message: "Enter role salary:", validate: input => !isNaN(input) || "Enter a valid number!" },
        { 
            type: "list", 
            name: "departmentId", 
            message: "Select department:",
            choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
        },
    ]);
    
    console.log(await addRole(
        roleDetails.title,
        parseFloat(roleDetails.salary), 
        parseInt(roleDetails.departmentId)
    ));
};

const deleteRolePrompt = async () => {
    const roles = await viewRoles();
    
    if (roles.length === 0) {
        console.log(chalk.yellow("No roles available to delete."));
        return;
    }
    
    const { roleId, confirmDelete } = await inquirer.prompt([
        { 
            type: "list", 
            name: "roleId", 
            message: "Select role to delete:",
            choices: roles.map(role => ({ 
                name: `${role.title} (${role.department || 'No Department'})`, 
                value: role.id 
            }))
        },
        {
            type: "confirm",
            name: "confirmDelete",
            message: "WARNING: This will delete all employees with this role! Are you sure?",
            default: false
        }
    ]);
    
    if (confirmDelete) {
        try {
            console.log(chalk.green(await deleteRole(roleId)));
        } catch (error) {
            console.log(chalk.red("Cannot delete role with associated employees. Update or delete those employees first."));
            console.error(error.message);
        }
    } else {
        console.log(chalk.yellow("Deletion cancelled."));
    }
};

// Employee prompts
const viewEmployeesByManagerPrompt = async () => {
    // Get all managers (employees who are managers)
    const { rows: managers } = await db.query(
        `SELECT DISTINCT m.id, m.first_name, m.last_name 
         FROM employee e 
         JOIN employee m ON e.manager_id = m.id 
         ORDER BY m.last_name, m.first_name`
    );
    
    if (managers.length === 0) {
        console.log(chalk.yellow("No managers found in the system."));
        return;
    }
    
    const { managerId } = await inquirer.prompt([
        {
            type: "list",
            name: "managerId",
            message: "Select a manager to view their employees:",
            choices: managers.map(mgr => ({ 
                name: `${mgr.first_name} ${mgr.last_name}`, 
                value: mgr.id 
            }))
        }
    ]);
    
    const employees = await viewEmployeesByManager(managerId);
    
    if (employees.length === 0) {
        console.log(chalk.yellow("No employees found for this manager."));
    } else {
        console.table(employees);
    }
};

const viewEmployeesByDepartmentPrompt = async () => {
    const departments = await viewDepartments();
    
    if (departments.length === 0) {
        console.log(chalk.yellow("No departments available."));
        return;
    }
    
    const { departmentId } = await inquirer.prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Select a department:",
            choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
        }
    ]);
    
    const employees = await viewEmployeesByDepartment(departmentId);
    
    if (employees.length === 0) {
        console.log(chalk.yellow("No employees found in this department."));
    } else {
        console.table(employees);
    }
};

const addEmployeePrompt = async () => {
    // Get roles for selection
    const roles = await viewRoles();
    
    if (roles.length === 0) {
        console.log(chalk.yellow("No roles available. Please create a role first."));
        return;
    }
    
    // Get employees for manager selection
    const employees = await viewEmployees();
    
    const employeeDetails = await inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Enter employee's first name:",
            validate: input => input ? true : "First name cannot be empty!"
        },
        {
            type: "input",
            name: "lastName",
            message: "Enter employee's last name:",
            validate: input => input ? true : "Last name cannot be empty!"
        },
        {
            type: "list",
            name: "roleId",
            message: "Select employee's role:",
            choices: roles.map(role => ({ 
                name: `${role.title} (${role.department || 'No Department'})`, 
                value: role.id 
            }))
        },
        {
            type: "list",
            name: "managerId",
            message: "Select employee's manager:",
            choices: [
                { name: "None", value: null },
                ...employees.map(emp => ({ 
                    name: `${emp.first_name} ${emp.last_name}`, 
                    value: emp.id 
                }))
            ]
        }
    ]);
    
    console.log(chalk.green(await addEmployee(
        employeeDetails.firstName,
        employeeDetails.lastName,
        employeeDetails.roleId,
        employeeDetails.managerId
    )));
};

const deleteEmployeePrompt = async () => {
    const employees = await viewEmployees();
    
    if (employees.length === 0) {
        console.log(chalk.yellow("No employees available to delete."));
        return;
    }
    
    const { employeeId, confirmDelete } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Select employee to delete:",
            choices: employees.map(emp => ({ 
                name: `${emp.first_name} ${emp.last_name} - ${emp.job_title || 'No Role'}`, 
                value: emp.id 
            }))
        },
        {
            type: "confirm",
            name: "confirmDelete",
            message: "Are you sure you want to delete this employee? This cannot be undone.",
            default: false
        }
    ]);
    
    if (confirmDelete) {
        try {
            console.log(chalk.green(await deleteEmployee(employeeId)));
        } catch (error) {
            console.log(chalk.red("Cannot delete employee. They may be assigned as a manager to others."));
            console.error(error.message);
        }
    } else {
        console.log(chalk.yellow("Deletion cancelled."));
    }
};

const updateEmployeeRolePrompt = async () => {
    const employees = await viewEmployees();
    const roles = await viewRoles();
    
    if (employees.length === 0) {
        console.log(chalk.yellow("No employees available to update."));
        return;
    }
    
    if (roles.length === 0) {
        console.log(chalk.yellow("No roles available. Please create a role first."));
        return;
    }
    
    const { employeeId, roleId } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Select employee to update:",
            choices: employees.map(emp => ({ 
                name: `${emp.first_name} ${emp.last_name} - ${emp.job_title || 'No Role'}`, 
                value: emp.id 
            }))
        },
        {
            type: "list",
            name: "roleId",
            message: "Select new role:",
            choices: roles.map(role => ({ 
                name: `${role.title} (${role.department || 'No Department'})`, 
                value: role.id 
            }))
        }
    ]);
    
    console.log(chalk.green(await updateEmployeeRole(employeeId, roleId)));
};

const updateEmployeeManagerPrompt = async () => {
    const employees = await viewEmployees();
    
    if (employees.length === 0) {
        console.log(chalk.yellow("No employees available to update."));
        return;
    }
    
    const { employeeId, managerId } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Select employee to update:",
            choices: employees.map(emp => ({ 
                name: `${emp.first_name} ${emp.last_name}`, 
                value: emp.id 
            }))
        },
        {
            type: "list",
            name: "managerId",
            message: "Select new manager:",
            choices: [
                { name: "None", value: null },
                ...employees.map(emp => ({ 
                    name: `${emp.first_name} ${emp.last_name}`, 
                    value: emp.id 
                })).filter(emp => emp.value !== parseInt(employeeId)) // Can't be own manager
            ]
        }
    ]);
    
    console.log(chalk.green(await updateEmployeeManager(employeeId, managerId)));
};

// Main menu logic
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
            console.log(chalk.magenta.bold("Goodbye!"));
            await db.end(); // Close the connection
            process.exit(0);
        }
        
        // Route to the appropriate handler based on action type
        if (action.startsWith('view') || action === 'addDepartment' || 
            action === 'deleteDepartment' || action === 'viewBudget') {
            await handleDepartmentActions(action);
        } 
        else if (action.includes('Role')) {
            await handleRoleActions(action);
        }
        else if (action.includes('Employee') || action.includes('Manager')) {
            await handleEmployeeActions(action);
        }
        
        // Return to main menu
        await mainMenu();
    } catch (error) {
        console.error("An error occurred:", error);
        await mainMenu();
    }
};

// Start the application
mainMenu();