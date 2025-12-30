insert into employee(Fname, Lname, SSN, BDate, Address, Sex, Salary)
values("noor", "elmobashar", 1122334, "2003-07-19", "Damietta Ras Elbar S19 B13", "M", 20000);

insert into department(Dname, Dnum, MGRSSN, MGRStartDate)
values("HR", 140, 1122334, "2024-09-12");

update employee set Dno = 140 where SSN = 1122334;

insert into employee(Fname, Lname, SSN, BDate, Address, Sex, Salary, Superssn, Dno)
values("kareen", "sultan", 2233444, "2002-08-23", "Mansoura Elmahala", "M", 30000, 1122334, 140);

insert into project(Pname, Pnumber, Plocation, City, Dnum)
values("Al Solimanya", 1400, "Cairo_Alex Road", "Alex", 140);

insert into works_for(ESSN, Pno, Hours)
values(1122334, 1400, 40);

insert into dependent(ESSN, Dependent_name, Sex, Bdate)
values(1122334, "Seif Nooreldeen Elmobashar", "M", "2027-12-23");

-- AI Generated Data

-- Insert Amr Omran (Top Manager - No Super)
INSERT INTO employee VALUES ("Amr", "Omran", 321654, "1963-09-14", "44 Hilopolis.Cairo", "M", 2500, NULL, NULL);

-- Insert Managers (Who report to Amr)
INSERT INTO employee VALUES ("Kamel", "Mohamed", 223344, "1970-10-15", "38 Mohy el dien abo el Ezz St.Cairo", "M", 1800, 321654, NULL);
INSERT INTO employee VALUES ("Noha", "Mohamed", 968574, "1975-02-01", "55 Orabi St. El Mohandiseen .Cairo", "F", 1600, 321654, NULL);
INSERT INTO employee VALUES ("Edward", "Hanna", 512463, "1972-08-19", "18 Abaas El 3akaad St. Nasr City.Cairo", "M", 1500, 321654, NULL);

-- Insert Regular Employees
INSERT INTO employee VALUES ("Ahmed", "Ali", 112233, "1965-01-01", "15 Ali fahmy St.Giza", "M", 1300, 223344, NULL);
INSERT INTO employee VALUES ("Hanaa", "Sobhy", 123456, "1973-03-18", "38 Abdel Khalik Tharwat St. Downtown.Cairo", "F", 800, 223344, NULL);
INSERT INTO employee VALUES ("Mariam", "Adel", 669955, "1982-06-12", "269 El-Haram st. Giza", "F", 750, 512463, NULL);
INSERT INTO employee VALUES ("Maged", "Raoof", 521634, "1980-04-06", "18 Kholosi st.Shobra.Cairo", "M", 1000, 968574, NULL);

-- ---------------------------------------------------------
-- 2. INSERT DEPARTMENTS
-- ---------------------------------------------------------
INSERT INTO department VALUES ("DP1", 10, 223344, "2005-01-01");
INSERT INTO department VALUES ("DP2", 20, 968574, "2006-03-01");
INSERT INTO department VALUES ("DP3", 30, 512463, "2006-06-01");

-- ---------------------------------------------------------
-- 3. UPDATE EMPLOYEES (Link them to Departments)
-- ---------------------------------------------------------
UPDATE employee SET Dno = 10 WHERE SSN IN (112233, 223344, 123456);
UPDATE employee SET Dno = 20 WHERE SSN IN (968574, 669955);
UPDATE employee SET Dno = 30 WHERE SSN IN (512463, 521634);
-- Note: Amr Omran's Dno was listed as NULL/Blank in your data, so we leave it NULL.

-- ---------------------------------------------------------
-- 4. INSERT PROJECTS
-- ---------------------------------------------------------
INSERT INTO project VALUES ("AL Solimaniah", 100, "Cairo_Alex Road", "Alex", 10);
INSERT INTO project VALUES ("Al Rabwah", 200, "6th of October City", "Giza", 10);
INSERT INTO project VALUES ("Al Rawdah", 300, "Zaied City", "Giza", 10);
INSERT INTO project VALUES ("Al Rowad", 400, "Cairo_Faiyom Road", "Giza", 20);
INSERT INTO project VALUES ("Al Rehab", 500, "Nasr City", "Cairo", 30);
INSERT INTO project VALUES ("Pitcho american", 600, "Maady", "Cairo", 30);
INSERT INTO project VALUES ("Ebad El Rahman", 700, "Ring Road", "Cairo", 20);

-- ---------------------------------------------------------
-- 5. INSERT WORKS_FOR
-- ---------------------------------------------------------
INSERT INTO works_for(ESSN, Pno, Hours) VALUES
(223344, 100, 10),
(223344, 200, 10),
(223344, 300, 10),
(112233, 100, 40),
(968574, 400, 15),
(968574, 700, 15),
(968574, 300, 10),
(669955, 400, 20),
(223344, 500, 10),
(669955, 700, 7),
(669955, 300, 10),
(512463, 500, 10),
(512463, 600, 25),
(521634, 500, 10),
(521634, 600, 20),
(521634, 300, 6),
(521634, 400, 4);

-- ---------------------------------------------------------
-- 6. INSERT DEPENDENTS
-- ---------------------------------------------------------
INSERT INTO dependent VALUES (112233, "Hala Saied Ali", "F", "1970-10-18");
INSERT INTO dependent VALUES (223344, "Ahmed Kamel Shawki", "M", "1998-03-27");
INSERT INTO dependent VALUES (223344, "Mona Adel Mohamed", "F", "1975-04-25");
INSERT INTO dependent VALUES (321654, "Ramy Amr Omran", "M", "1990-01-26");
INSERT INTO dependent VALUES (321654, "Omar Amr Omran", "M", "1993-03-30");
INSERT INTO dependent VALUES (321654, "Sanaa Gawish", "F", "1973-05-16");
INSERT INTO dependent VALUES (512463, "Sara Edward", "F", "2001-09-15");
INSERT INTO dependent VALUES (512463, "Nora Ghaly", "F", "1976-06-22");