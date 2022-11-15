const connection = require('./config/connection');
const inquirer = require('inquirer');
const cTable = require('console-table');

connection.connect((err) => {
    if (err) throw err;
    console.log('Employee Tracker')
    promptUser()
});

const promptUser = () => {
    inquirer.prompt({
        name: "choices",
        type: "list",
        message: "Please select an option",
        choices: [
            'View All Employees',
            'View All Roles',
            'View All Departments',
            'Update Employee Role',
            'Update Employee Manger',
            'Add Employee',
            'Add Role',
            'Add Department',
            'Remove Employee',
            'Remove Role',
            'Remove Department',
            'Exit'
        ]
    }).then((answers) =>  {
            const { choices } = answers;
            if (choices === 'View All Employees') {
                viewAllEmployees();
            }

            if (choices === 'View All Departments') {
                viewAllDepartments();
            }

            if (choices === 'Add Employee') {
                addEmployee();
            }

            if (choices === 'Remove Employee') {
                removeEmployee();
            }

            if (choices === 'Update Employee Role') {
                updateEmployeeRole();
            }

            if (choices === 'View All Roles') {
                viewAllRoles();
            }

            if (choices === 'Add Role') {
                addRole();
            }

            if (choices === 'Remove Role') {
                removeRole();
            }

            if (choices === 'Add Department') {
                addDepartment();
            }

            if (choices === 'Remove Department') {
                removeDepartment();
            }

            if (choices === 'Exit') {
                connection.end();
            }
        });
};

const viewAllEmployees = () => {
    let sql =
        `SELECT employee.id, 
    employee.first_name, 
    employee.last_name,
    role.title,
    department.department_name AS 'department', 
    role.salary
    FROM employee, role, department 
    WHERE department.id = role.department_id 
    AND role.id = employee.role_id
    ORDER BY employee.id ASC`;
    connection
    .query(sql, (error, response) => {
        if (error) throw error;
        console.log('Current Employees')
        console.log(response)
        promptUser();
    })
};

const viewAllRoles = () => {
    console.log('Current Employee Roles');
    const sql = `SELECT role.id, role.title, department.department_name AS department
            From role
            INNER JOIN department ON role.department_id = department.id`;
    connection.query(sql, (error, response) => {
        if (error) throw error;
        response.forEach((role) => { console.log(role.title); });
        promptUser();

    })
};
const viewAllDepartments = () => {
    const sql = `SELECT department.id AS id, department.department_name AS department FROM department`;
    connection.query(sql, (error, response) => {
        if (error) throw error;
        response.forEach((department) => { console.table(department.department); });
        promptUser();
    })
};

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
            validate: addFirstName => {
                if (addFirstName) {
                    return true;

                } else { console.log('Please enter a first name') }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: addLastName => {
                if (addLastName) {
                    return true;

                } else { console.log('Please enter a last name') }
            }
        }
    ])

        .then(answer => {
            const crit = [answer.firstName, answer.lastName]
            const roleSql = `SELECT role.id, role.title FROM role`;
            connection.promise().query(roleSql, (error, data) => {
                if (error) throw error;
                const roles = data.map(({ id, title }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employees role?',
                        choices: roles

                    }

                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        crit.push(role);
                        const managerSql = `SELECT * FROM employee`;
                        connection.promise().query(managerSql, (error, data) => {
                            if (error) throw error;
                            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name = '' + last_name, value: id }));
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'managers',
                                    message: 'Who is the employees manager',
                                    choices: managers

                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    const sql = `INSERT INTO employee (first_name, last_name, manager_id)
                        VALUES (?,?,?,?)`;
                                    connection.query(sql, crit, (error) => {
                                        if (error) throw error;
                                        console.log("employee has been added!")
                                        viewAllEmployees()
                                    })
                                })
                        })
                    })
            })
        })

    const addRole = () => {
        const sql = 'SELECT * FROM department'
        connection.promise().query(sql, (error, response) => {
            if (error) throw error;
            let deptNamesArray = [];
            response.forEach((department) => { deptNamesArray.push(department.department_name); });
            deptNamesArray.push('Create Department');
            inquirer
                .prompt([
                    {
                        name: 'departmentName',
                        type: 'list',
                        message: 'Which department is this new role in?',
                        choices: deptNamesArray
                    }
                ])
                .then((answer) => {
                    if (answer.departmentName === 'Create Department') {
                        this.addDepartment();
                    } else {
                        addRoleResume(answer);
                    }
                });


            const addRoleResume = (departmentData) => {
                inquirer
                    .prompt([
                        {
                            name: 'newRole',
                            type: 'input',
                            message: 'What is the name of your new role?',
                            validate: validate.validateString
                        },
                        {
                            name: 'salary',
                            type: 'input',
                            message: 'What is the salary of this new role?',
                            validate: validate.validateSalary
                        }
                    ])

                    .then((answer) => {
                        let createdRole = answer.newRole;
                        let departmentId;

                        response.forEach((department) => {
                            if (departmentData.departmentName === department.department_name) { departmentId = department.id; }
                        })

                        let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                        let crit = [createdRole, answer.salary, departmentId];

                        connection.promise().query(sql, crit, (error) => {
                            if (error) throw error;
                            console.log(`Role successfully created!`);
                            viewAllRoles();

                        });
                    });
            };

        const addDepartment = () => {
            inquirer.prompt([
                {
                    name: 'newDepartment',
                    type: 'input',
                    message: 'What is the name of your new department?',
                    validate: validate.validateString
                }
            ])
                .then((answer) => {
                    let sql = `INSERT INTO department (department_name) VALUES (?)`;
                    connection.query(sql, answer.newDepartment, (error, response) => {
                        if (error) throw error;
                        console.log('Department successfully created!');
                        viewAllDepartments();

                    });
                });
        }
        
        
    }

