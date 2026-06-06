const fs = require("fs");

const filePath = "students.json";

const readFileSync = function (filePath) { 
    try {
        return fs.readFileSync(filePath, "utf-8"); 
    } catch (error) {
        console.log(error);
    }
}
const readFileAsync = function (filePath) {
    try {
        return fs.readFile(filePath, "utf-8");
    } catch (error) {
        console.log(error);
    }
}
const writeFileSync = function (filePath, data) { 
    try {
        return fs.writeFileSync(filePath, JSON.stringify(data)); 
    } catch (error) {
        console.log(error);
    }
}
const writeFileAsync = function (filePath, data) { 
    try {
        return fs.writeFile(filePath, JSON.stringify(data)); 
    } catch (error) {
        console.log(error);
    }
}

const addStudent = function (filePath, student) {
    const data = JSON.parse(readFileSync(filePath));
    data.push(student);
    writeFileSync(filePath, data);
}

const updateStudentCourse = function (filePath, studentId, course) {
    const data = JSON.parse(readFileSync(filePath));
    const student = data.find((student) => student.id === studentId);
    student.course = course;
    writeFileSync(filePath, data);
}

const deleteStudent = function (filePath, studentId) {
    const data = JSON.parse(readFileSync(filePath));
    const student = data.find((student) => student.id === studentId);
    data.splice(data.indexOf(student), 1);
    writeFileSync(filePath, data);
}



//Add new student
const newStudent = { id: 4, name: "Noor Elmobasher", age: 20, course: "Web Development", grades: { html: 95, javascript: 89 } };
addStudent(filePath, newStudent);
console.log(JSON.parse(readFileSync(filePath)));

//Update a student course
const studentIdToUpdate = 1;
updateStudentCourse(filePath, studentIdToUpdate, "CS");
console.log(JSON.parse(readFileSync(filePath)));

//Delete a student
const studentIdToDelete = 4;
deleteStudent(filePath, studentIdToDelete);
console.log(JSON.parse(readFileSync(filePath)));


  