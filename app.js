
// require Node's built-in Modules
const os = require('os');

// require third-party Modules
const logger = require('logger').createLogger('log.txt');
const yargs = require('yargs');

// require custom Module
const users = require('./users');

// Get user info from OS
var appUser = os.userInfo();

// Get User input
var command = process.argv[2];
var args = yargs.argv;
var userName = args.username;
var password = args.password;
var email = args.email;

var logStatus = 'Failure';
var logMsg = '';

// validate data
if (command.match(/-/g)) {
    // no command sent
    logMsg = 'Command not found';
} else {
    // process command
    if (command === 'create') {
        if (userName !== undefined && password !== undefined && email !== undefined) {
            var user = users.insertUser(userName, password, email);
            if (user) {
                logStatus ='Success';
                logMsg(`User Created: ${user.name} ${user.password} ${user.email}.`);
            } else {
                logMsg(`User not created: Duplicate user (${userName}) (${email}) found!`);
            }
        } else {
            logMsg('Missing User Data param(s).');
        }
    } else if (command === 'read') {
        if (userName === undefined) {
            logMsg('Missing User name param.');
        } else {
            var user = users.getUser(userName);
            if (user) {
                logStatus = 'Success';
                logMsg(`User: ${user.name} ${user.email}.`);
            } else {
                logMsg(`User (${userName}) not found!`);
            }
        }
    } else if (command === 'update') {
        if (userName !== undefined && password !== undefined && email !== undefined) {
            var user = users.updateUser(userName, password, email);
            if (user) {
                logStatus = 'Success';
                logMsg(`User Updated: ${user.username} ${user.email}.`);
            } else {
                logMsg(`User (${userName}) not found!`);
            }
        } else {
            logMsg('Missing User Data param(s).');
        }
    
    } else if (command === 'delete') {
        if (userName === undefined || password === undefined) {
            logMsg('Missing User name param.');
        } else {
            var user = users.deleteUser(userName, password);
            if (user) {
                logStatus = 'Success';
                logMsg(`User (${userName}) deleted.`);
            } else {
                logMsg(`User (${userName}) not found!`);
            }
        }
    } else if (command === 'list') {
        if (userName === undefined || password === undefined) {
            logMsg = 'Missing credentials.';
        } else if (userName !== "Admin" || password !== "admin") {
            logMsg = 'Invalid credentials.';
        } else {
            var userList = users.listUsers();
            if (userList.length === 0) {
                logMsg = 'No users found.';
            } else {
                logStatus = 'Success';
                logMsg = ('Users:');
                userList.forEach((val) => {
                    logMsg += `${val.username}, ${val.email}'; `;
                });
            }
        }
    } else {
        logMsg = `Command (${command}) not able to be processed.`;
    }
}

// Write log file
logger.info('App accessed by', `${appUser.username}: ${logStatus} - ${logMsg}`);