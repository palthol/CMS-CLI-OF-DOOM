const { mainMenu } = require('./handlers');
const db = require('./db/connection');

// Application banner
console.log('\n======================================');
console.log('       EMPLOYEE TRACKER SYSTEM        ');
console.log('======================================\n');

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nClosing database connection and exiting...');
    await db.end();
    process.exit(0);
});

// Start application
mainMenu();