use company;

-- Question 1
SELECT 
    d.dname,
    d.dnum,
    e.ssn,
    CONCAT(e.fname, ' ', e.lname) AS 'fullName'
FROM
    employee e,
    department d
WHERE
    e.ssn = d.mgrssn;
    
    
-- Question 2
SELECT 
    d.dname, p.pname
FROM
    department d,
    project p
WHERE
    p.dnum = d.dnum;
    
    
-- Question 3
SELECT 
    CONCAT(e.fname, ' ', e.lname) AS 'dependedOn',
    d.dependent_name,
    d.sex,
    d.bdate
FROM
    employee e,
    dependent d
WHERE
    e.ssn = d.essn;
    
    
-- Question 4
SELECT 
    *
FROM
    employee e,
    department d
WHERE
    e.ssn = d.mgrssn;
    
    
-- Question 5
SELECT 
    pnumber, pname, plocation
FROM
    project
WHERE
    city IN ('Cairo' , 'Alex');
    
    
-- Question 6
SELECT 
    pnumber, pname, plocation
FROM
    project
WHERE
    pname like 'a%';
    
    
-- Question 7
SELECT 
    *
FROM
    employee
WHERE
    dno = 30
        AND salary BETWEEN 1000 AND 2000;
        
        
-- Question 8
SELECT 
    CONCAT(e.fname, ' ', e.lname) AS 'fullName'
FROM
    employee e,
    project p,
    works_for w
WHERE
    e.dno = 10 AND w.hours >= 10
        AND w.essn = e.ssn
        AND p.pname = 'Al Rabwah'
        AND p.pnumber = w.pno;
    
    
-- Question 9
SELECT
    CONCAT(e.fname, ' ', e.lname) AS 'fullName'
FROM
    employee e
WHERE
    e.Superssn in (select ssn from employee where fname = "Kamel" and lname = "Mohamed");
    
    
-- Question 10
SELECT 
    p.pname, SUM(w.hours)
FROM
    works_for w,
    project p
WHERE w.pno = p.pnumber
GROUP BY p.pname;


-- Question 11
SELECT 
    *
FROM
    employee e,
    department dep
WHERE
    e.ssn = dep.mgrssn
        AND e.ssn NOT IN (SELECT 
            e.ssn
        FROM
            employee e
                INNER JOIN
            dependent dt ON e.ssn = dt.essn);
            
            
-- Question 12
SELECT
    d.dname, d.dnum, d.mgrssn, d.mgrstartdate, MIN(e.ssn)
FROM
    department d,
    employee e
WHERE
    e.dno = d.dnum
GROUP BY d.dnum
ORDER BY MIN(e.ssn)
LIMIT 1;
    
-- Question 13
SELECT 
    e.ssn, e.fname, e.lname, p.pname
FROM
    employee e,
    works_for w,
    project p
WHERE
    p.pnumber = w.pno AND e.ssn = w.essn;

-- -----------------------------------------------------------------------------

