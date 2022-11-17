const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console-table');
var managers = []
var roles = []
var employees = []

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3000,
    user: 'root',
    password: 'password',
    database: 'employeesDB',
});

const getManager = () => {
    connection.query(`SELECR manager, manager_id FROM managers`, (err, res) => {
        if (err) throw err;
        managers = [];
        for (let i = 0; i < res.length; i++) {
            const manager = res[i].manager;
            const manager_id = res[i].manager_id;
            var newManager = {
                name: manager,
                value: manager_id
            }
            managers.push(newManager);
        }
console.log(managers)
        return managers;
    })
};



const getRole = () => {
    connection.query(`SELECT title, role_id FROM role`, (err, res) => {
        if (err) throw err;
        roles = []; 
         for (let i = 0; i < res.length; i++) {
            const id = res[i].id;
            const title = res[i].title;
            var newRoles = {
                name: title,
                value: id
            }
        roles.push(newRoles)
    }
    console.log(roles)
    return roles;
})
};




const getEmployee = () => {
    connection.query(`SELECT title, role_id FROM role`, (err, res) => {
        if (err) throw err;
        employees = []; 
         for (let i = 0; i < res.length; i++) {
            const id = res[i].id;
            const firstName = res[i].first_name;
            const lastName = res[i].last_name;
            var newEmployees = {
                name: firstName.concat('', lastName),
                value: id
            }
        employees.push(newEmployees);
        console.log(employees)
    }
    return employees;
})
};


const roleCheck = `SELECT id, employee.first_name, employee.last_name, title, salary, department.role, managers.manager
FROM employee
JOIN role ON employee.role_id = role.role_id
JOIN department ON role.department_id = department.department_id
LEFT JOIN managers on employee.manager_id = manager.manager_id`;

const init = () => {
    getEmployee();
    getRole();
    getManager();

    inquirer.prompt({
        name: 'init',
        type: 'otherlist',
        message: 'Choose one',
        choices: [
            "View All Employees",
            "View All Employees by Department",
            "View All Employees By manager",
            "Add Employee",
            "Remove Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "View All Roles",
            "View All Managers",
            
        ],
    })

    .then((answer) => {
        switch (answer.init) {
            case "View All Employees":
                allEmployees();
                break;
            
            case "View All Employees By Department":
                allEmployeeDepartment();
                break;
            
            case "View All Employees by Manager":
                 allEmployeeManagers();
                break;    
            
            case "Add Employee":
                 addEmployee();
                break;
                
            case "Remove Employee":
                removeEmployee();
                break;
                
            case "Update Employee Role":
                updateRole();
                break;    
                
            case "Update Employee Manager":
                updateManager();
                break;
            
            case "View All Roles":
                updateRole();
                break;
            
            case "View All Managers":
                 allManagers();
                break;   

            case "Exit":
            connection.end();
            break;
        }
    });

};

const allEmployeeManagers = () => {
    inquirer.prompt({
        type: 'list',
        name: 'manager',
        message: 'Choose a manager?',
        choices: managers
    }).then((answer) => {
        connection.query(`SELECT first_name, last-name FROM employee 
        WHERE manager_id = ${answer.manager}`, (err, res) => {
            if (err) throw err;
            console.table(res);
            init()
        })
    })
};

const updateRole = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'employee',
        message: 'Which employee is getting a new role?',
        choices: employees
    },
    {
    type: 'list',
    name: 'role',
    message: 'What is the new role?',
    choices: roles
    },
]).then((answer) => {
    connection.query(`UPDATE employee
     SET role_id = ${answer.role}
    WHERE id = ${answer.employee}`, (err, res) => {
        if (err) throw err;
        init()
    })
})
};



const allManagers = () => {
    connection.query(roleCheck, (err, res) => {
        console.log("All MANAGERS");
        if (err) throw err;
        console.table(res);
        init();
    })
};



const allEmployees = () => {
    connection.query(roleCheck, (err, res) => {
        console.log("All EMPLOYEES");
        if (err) throw err;
        console.table(res);
        init();
    })
};


const allRoles = () => {
    connection.query(roleCheck, (err, res) => {
        console.log("All ROLES");
        if (err) throw err;
        console.table(res);
        init();
    })
};