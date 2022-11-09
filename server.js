const connection = require('./config/connection');
const inquirer = require('inquirer');
const cTable = require('console-table');

connection.connect((err) => {
    if (err) throw err;
    console.log('Employee Tracker')
    promptUser()
});
