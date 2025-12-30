-- Question 1
insert into employee(Fname, Lname, SSN, BDate, Address, Sex, Salary, Superssn, Dno)
values("nooreldeen", "ayman", 102672, "2003-07-19", "Damietta Ras Elbar S19 B13", "M", 20000, 112233, 30);


-- Question 2
insert into employee(Fname, Lname, SSN, BDate, Address, Sex, Salary, Dno)
values("mohamed", "waleed", 102660, "2003-07-19", "Damietta Ras Elbar S19 B13", "M",2000, 30);

-- Question 3
insert into department(Dname, Dnum, MGRSSN, MGRStartDate)
values("DEPT IT", 100, 112233, "2006-11-01");

-- Question 4

update department set MGRSSN = 968574 where Dnum = 100;
update department set MGRStartDate = "2025-12-01" where Dnum = 100;

update department set MGRSSN = 102672 where Dnum = 20;
update department set MGRStartDate = "2025-12-01" where Dnum = 20;

update employee set Superssn = 102672 where SSN = 102660;


-- Question 5
update department set MGRSSN = 102660 where Dnum = 10;
update department set MGRStartDate = "2025-12-01" where Dnum = 10;
delete from employee where SSN = 223344;

-- Question 6
update employee set salary = salary + salary * (20/100) where SSN = 102672; 




