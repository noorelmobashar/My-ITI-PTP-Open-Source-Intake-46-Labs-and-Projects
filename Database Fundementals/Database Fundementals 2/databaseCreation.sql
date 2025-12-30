create database company;
use company;
create table employee (
	Fname varchar(255) not null,
    Lname varchar(255) not null,
    SSN int primary key,
    BDate date not null,
    Address text not null,
    Sex varchar(1) not null,
    Salary int not null,
    Superssn int,
    Dno int
);

create table department (
	Dname varchar(255) not null,
    DNum int primary key,
    MGRSSN int not null,
    MGRStartDate date not null
);

create table project (
	Pname varchar(255) not null,
    Pnumber int primary key,
    Plocation text not null,
    City varchar(255) not null,
    Dnum int not null
);

create table works_for (
	id int primary key auto_increment,
    ESSN int not null,
    Pno int not null,
	Hours int not null
);

create table dependent (
	ESSN int not null,
	Dependent_name varchar(255) not null,
    Sex varchar(1) not null,
    Bdate date not null
);

alter table employee add constraint fk_emp_ssn foreign key (Superssn) references employee(SSN) on delete set null;
alter table employee add constraint fk_emp_dnum foreign key (Dno) references department(DNum) on delete set null;
alter table department add constraint fk_dep_ssn foreign key (MGRSSN) references employee(SSN);
alter table project add constraint fk_pro_dep foreign key (Dnum) references department(DNum);
alter table works_for add constraint fk_pro_essn foreign key (ESSN) references employee(SSN) on delete cascade;
alter table works_for add constraint fk_pro_pno foreign key (Pno) references project(Pnumber) on delete cascade;
alter table dependent add constraint fk_depen_essn foreign key (ESSN) references employee(SSN) on delete cascade;
-- drop database company;