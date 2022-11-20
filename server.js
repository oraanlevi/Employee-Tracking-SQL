const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console-table');
var managers = [];
var roles = [];
var employees = [];

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1221root',
    database: 'employeesDB',
});

const getManager = () => {
    connection.query(`SELECT manager, manager_id FROM managers`, (err, res) => {
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
//console.log(managers)
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
    //console.log(roles)
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
       // console.log(employees)
    }
    return employees;
})
};


const roleCheck = `SELECT id, employee.first_name, employee.last_name, title, salary, department.name, managers.manager
FROM employee
LEFT JOIN role ON employee.role_id = role.role_id
LEFT JOIN department ON role.department_id = department.department_id
LEFT JOIN managers on employee.manager_id = managers.manager_id`;

const allRolesQuery = `Select * from role JOIN department ON role.department_id = department.department_id`;

const allDepartmentsQuery = `SELECT * from department`;

const init = () => {
    //getEmployee();
    getRole();
    getManager();

    inquirer.prompt({
        name: 'init',
        type: 'list',
        message: 'Choose one',
        choices: [

            "View All Employees",
            "Add Employee",
            "Remove Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "View All Roles",
            "View All Departments",
            
        ],
    })
    .then((answer) => {
        switch (answer.init) {
            case "View All Employees":
                allEmployees();
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
                    allRoles();
                    break;
                
                case "View All Departments":
                    allManagers();
                    break;   

                case "Exit":
                connection.end();
                break;
        }
    });

};

//const allEmployeeManagers = () => {
    //inquirer.prompt({
      //  type: 'list',
       // name: 'manager',
      //  message: 'Choose a manager?',
     //   choices: managers
   // }).then((answer) => {
      //  connection.query(`SELECT first_name, last_name FROM employee 
      //  WHERE manager_id = ${answer.manager}`, (err, res) => {
      //      if (err) throw err;
       //     console.table(res);
    //        init()
    //        console.log(answer.init)
   ////     })
  //  })
//};

const updateManager = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'employee',
        message: 'What employee is getting a new manager?',
        choices: employees
    },
    {
    type: 'list',
    name: 'manager',
    message: 'Who is your new manager?',
    choices: managers
    },
]).then((answer) => {
    connection.query(`UPDATE employee
     SET manager_id = ${answer.manager}
    WHERE id = ${answer.employee}`, (err, res) => {
        if (err) throw err;
        init()
    })
})
};

const updateRole = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'employee',
        message: 'Whose role are we updating?',
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
     SET role_id 
    WHERE id = employee`, (err, res) => {
        if (err) throw err;
        init()
    })
})
};



const allManagers = () => {
    connection.query(allDepartmentsQuery, (err, res) => {
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
    connection.query(allRolesQuery, (err, res) => {
        console.log("All ROLES");
        if (err) throw err;
        console.table(res);
        init();
    })
};

const allEmployeeDepartments = () => {
    inquirer.prompt({
        type: 'list',
        name: 'departments',
        message: 'Choose a department?',
        choices: ['Engineering', 'Finance', 'Legal' ]
    }).then((answer) => {
        if (answer.departments === 'Engineering') {
        connection.query(`SELECT employee.first_name, employee.last_name FROM employee
        JOIN role ON employee.role_id = role_id
        JOIN department ON role.department_id = department.department_id and department.name = "Engineering"`, (err, res) => {
            console.log('ENGINEERING')
            if (err) throw err;
            console.table(res);
            init()
        })
    }
    else if (answer.departments === 'Finance'){
        connection.query(`SELECT employee.first_name, employee.Last_name FROM employee
        JOIN role ON employee.role_id = role_id
        JOIN department ON role.department_id = department.department_id and department.name = "Finanace"`, (err, res) => {
            console.log('FINANACE')
            if (err) throw err;
            console.table(res);
            init()
        })
    }
    else if(answer.departments === 'Legal'){
        connection.query(`SELECT employee.first_name, employee.last_name FROM employee
        JOIN role ON employee.role_id = role_id
        JOIN department ON role.department_id = department.department_id and department.name = "Legal"`, (err, res) => {
            console.log('LEGAL')
            if (err) throw err;
            console.table(res);
            init()
        })
    }
    
});
};



const addEmployee = () => {
    managers.push('none');
    inquirer.prompt([
        {
        type: 'input',
        name: 'first_name',
        message: 'What is your first name?'
        },
        {
        type: 'input',
        name: 'last_name',
        message: 'What is your last name?'
        },
        {
        type: 'list',
        name: 'role',
        message: 'What is your position?',
        choices: roles
        },
        {
        type: 'list',
        name: 'manager',
        message: 'Who is your manager?',
        choices: managers
        },
    ]).then((answer) => {
        if (answer.manager === 'none') {
            connection.query(`INSERT INTO employee(first_name, last_name, role_id)
            VALUES (?,?,?)`, [answer.first_name, answer.last_name, answer.role], (err, res) => {
                if (err) throw err;
                init();
            });
        }

        else {
            connection.query(`INSERT INTO employee(first_name, last_name, role_id,)
            VALUES (?,?,?)`, [answer.first_name, answer.last_name, answer.role], (err, res) => {
                if (err) throw err;
                init();
        })
    }
})
}
    

const removeEmployee = () => {
    inquirer.prompt({
        type: 'list',
        name: 'employee',
        message: 'Who would you like to remove?',
        choices: employees 
    
    }).then((answer) => {
        connection.query(`DELETE FROM employee WHERE id =${answer.employee}`, (err, res) => {
            if (err) throw err;
            init();
        })
        console.log(answer)
    })
}
init()