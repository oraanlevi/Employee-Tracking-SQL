INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Jane", "Robbie", 1, null), ("Frank", "Love", 1, null), ("Maine", "Perry", 1, null), ("Style", "Jules", 1, null)

INSERT INTO managers(manager)
VALUES ("Jane Peck"), ("Rob Reid"), ("Harry Reid");

SELECT * FROM employee;
SELECT * FROM managers;