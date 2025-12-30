// check if user is logged in
checkLoggedInUser();

// get current user and students data
let currentUserData = getFromLocalStorage("loggedInUser");
let currentUser = new Teacher(currentUserData);
let navProfilePic = document.querySelector("#navProfilePic");
let dashboardProfilePic = document.querySelector("#dashboardProfilePic");
let dashboardUserName = document.querySelector("#dashboardUsername");
let managedExamsTableBody = document.querySelector("#managedExamsTable tbody");
let studentsData = getFromLocalStorage("students");
let students = studentsData.map(studentData => new Student(studentData));
dashboardUserName.innerText = currentUser.username;
dashboardProfilePic.src = currentUser.profilePicture;
navProfilePic.src = currentUser.profilePicture;


// make function to delete exam
function deleteExam(examId) {

    // confirm deletion
    let confirmDelete = confirm("Are you sure you want to delete this exam?");
    if (confirmDelete) {
        // delete exam from teacher
        currentUser.deleteExam(examId);
        // remove exam from all students
        students.forEach(student => {
            student.removeExam(examId);
        });
        // save changes
        saveToLocalStorage("students", students);
        saveToLocalStorage("loggedInUser", currentUser);
        window.location.reload();
    }

}

// check if user is teacher
if(currentUser.role !== 'teacher') {
    window.location.href = "studentDashboard.html";
}

// check if there are exams
if (currentUser.createdExams.length === 0) {
    let row = document.createElement("tr");
    let td = document.createElement("td");
    td.colSpan = 4;
    td.className = "text-center";
    td.innerText = "No exams created yet.";
    row.appendChild(td);
    managedExamsTableBody.appendChild(row);
}
else
{
    // list all exams
    currentUser.createdExams.forEach(exam => {

        let row = document.createElement("tr");
        let examNametd = document.createElement("td");
        examNametd.innerText = exam.examName;
        let examDurationtd = document.createElement("td");
        examDurationtd.innerText = `${exam.examDuration} mins`;
        let enrolledStudentstd = document.createElement("td");
        enrolledStudentstd.innerText = exam.enrolledStudents.length;
        let actionsTd = document.createElement("td");
        
        // make view button
        let viewBtn = document.createElement("button");
        viewBtn.className = "btn btn-info btn-sm view-exam-btn me-1";
        viewBtn.dataset.examId = exam.id;
        viewBtn.innerText = "View";
        viewBtn.addEventListener("click", () => {
            window.location.href = "viewExam.html?id=" + exam.id;
        });
        
        // make edit button
        let editBtn = document.createElement("button");
        editBtn.className = "btn btn-warning btn-sm edit-exam-btn me-1";
        editBtn.dataset.examId = exam.id;
        editBtn.innerText = "Edit";
        editBtn.addEventListener("click", () => {
            window.location.href = "editExam.html?id=" + exam.id;
        });
        
        // make delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-danger btn-sm delete-exam-btn";
        deleteBtn.dataset.examId = exam.id;
        deleteBtn.innerText = "Delete";
        deleteBtn.addEventListener("click", () => deleteExam(exam.id));

        actionsTd.appendChild(viewBtn);
        actionsTd.appendChild(editBtn);
        actionsTd.appendChild(deleteBtn);

        row.appendChild(examNametd);
        row.appendChild(examDurationtd);
        row.appendChild(enrolledStudentstd);
        row.appendChild(actionsTd);
        
        managedExamsTableBody.appendChild(row);
    });
}
// handle create new exam button
document.getElementById("createNewExamBtn").addEventListener("click", () => {
    window.location.href = "createExam.html";
});
