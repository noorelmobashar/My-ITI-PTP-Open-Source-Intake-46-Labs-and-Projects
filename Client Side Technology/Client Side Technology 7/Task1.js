// Task 1.1

const emailValidator = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//Task 1.4
const toPascalCase = (string) => string[0].toUpperCase() + string.substr(1).toLowerCase();

const registerStudent = () =>
{
    firstName = toPascalCase(prompt("Insert the Student First Name: "));
    lastName = toPascalCase(prompt("Insert the Student Last Name: "));
    age = prompt("Insert the Student Age: ");

    while(isNaN(age) || parseInt(age) < 12 || parseInt(age) > 30)
        age = prompt("Invalid input, the age should be an integer between 12 and 30");

    age = parseInt(age);
    email = prompt("Insert the Student Email: ");

    while(!emailValidator.test(email))
        email = prompt("Invalid Email, Insert the Student Email: ");
    
    department = prompt("Insert the Student Department: ");

    return {firstName, lastName, age, email, department, toString(){return `${this.firstName} ${this.lastName}`}};
}

//Task 1.2
let students = [];
let numberOfStudents = 2;
for(let i = 0;i < numberOfStudents;i++)
    students.push(registerStudent());

//Task 1.3
oldestStudent = students.reduce((prev, current)=>{
    if(current.age > prev.age)
    {
        return current;
    }
    return prev;
}, {age: 0});
console.log(oldestStudent.toString());


//Task 1.5
studentsGreaterThan20 = students.filter(obj=>obj.age > 20);
console.log(studentsGreaterThan20);

//Task 1.6
studentAges = students.reduce((prev, current)=>prev + current.age, 0);
console.log(studentAges / students.length);


//Task 1.7
students.sort((obj1, obj2) => {
    if(obj1.firstName < obj2.firstName)
        return -1;
    else if(obj1.firstName > obj2.firstName)
        return 1;
    else
        if(obj1.lastName > obj2.lastName)
            return -1;
        else if(obj1.lastName < obj2.lastName)
            return 1;

    return 0;       
})
console.log(students);


//Task 1.8
let array = [
    {
        fullName: {
            firstName: "Noor",
            lastName: "Ayman"
        },
        age: 30
    }
]

//Task 1.9
console.log(students[0] + "");

//Task 1.10
console.log(JSON.stringify(students));