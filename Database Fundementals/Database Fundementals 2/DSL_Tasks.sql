-- Question 1
select * from employee;

-- Question 2
select Fname, Lname, Salary, Dno from employee;

-- Question 3
select Pname, Plocation, Dnum from project;

-- Question 4
select concat(Fname, ' ', Lname) as Full_name, (Salary * 12 * 0.1) as ANNUAL_COMM from employee;

-- Question 5
select SSN, concat(Fname, ' ', Lname) as Full_name from employee where Salary > 1000;

-- Question 6
select SSN, concat(Fname, ' ', Lname) as Full_name from employee where Salary*12 > 10000;

-- Question 7
select concat(Fname, ' ', Lname) as Full_name, Salary from employee where Sex = "F";

-- Question 8
select Dnum, Dname from department where MGRSSN = 968574;

-- Question 9
select Pnumber, Pname, Plocation from project where Dnum = 10;