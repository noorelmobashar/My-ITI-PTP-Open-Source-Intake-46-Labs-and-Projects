// check if user is logged in
checkLoggedInUser();

// get current user data
let currentUser = getFromLocalStorage("loggedInUser");
let completedExamsTable = document.querySelector("#completedExamsTable tbody");
let dashboardProfilePic = document.querySelector("#dashboardProfilePic");
let dashboardUsername = document.querySelector("#dashboardUsername");
let requiredExamsTable = document.querySelector("#requiredExamsTable tbody");

// show user profile info
document.querySelector("#navProfilePic").src = currentUser.profilePicture;
dashboardProfilePic.src = currentUser.profilePicture;
dashboardUsername.textContent = currentUser.username;

// redirect if user is not student
if(currentUser.role !== 'student') {
    window.location.href = "teacherDashboard.html";
}

// show completed exams here
if (currentUser.completedExams.length === 0) {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td colspan="3" class="text-center">No completed exams yet.</td>
    `;
    completedExamsTable.appendChild(row);
}
else
{
    currentUser.completedExams.forEach(exam => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${exam.examName}</td>
            <td>${exam.score}</td>
            <td>${exam.date}</td>
        `;
        completedExamsTable.appendChild(row);
    });
}

// show required exams here
if (currentUser.requiredExams.length === 0) {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td colspan="4" class="text-center">No required exams assigned.</td>
    `;
    requiredExamsTable.appendChild(row);
}
else
{
    // check if there is an active exam session
    let activeSession = getFromLocalStorage("activeExamSession");
    let activeExamId = null;
    if (activeSession && activeSession.userId === currentUser.id) {
        activeExamId = activeSession.examId;
    }

    currentUser.requiredExams.forEach(reqExam => {
        // Find the full exam object
        let fullExam = null;
        let teachers = getFromLocalStorage("teachers");
        for (let teacher of teachers) {
            if (teacher.createdExams) {
                let found = teacher.createdExams.find(e => e.id === reqExam.id);
                if (found) {
                    fullExam = found;
                    break;
                }
            }
        }

        if (fullExam) {
            let row = document.createElement("tr");
            let btnClass = "btn-primary";
            let btnText = "Start Exam";
            let isDisabled = "";

            if (activeExamId) {
                if (fullExam.id === activeExamId) {
                    btnClass = "btn-success";
                    btnText = "Continue Exam";
                } else {
                    btnClass = "btn-secondary";
                    isDisabled = "disabled";
                }
            }

            row.innerHTML = `
                <td>${fullExam.examName}</td>
                <td>${fullExam.examDuration} mins</td>
                <td>${fullExam.questions.length}</td>
                <td><button class="btn ${btnClass} btn-sm start-exam-btn" data-exam-id="${fullExam.id}" ${isDisabled}>${btnText}</button></td>
            `;
            requiredExamsTable.appendChild(row);
        }
    });

    // Add event listeners
    document.querySelectorAll(".start-exam-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            let examId = this.getAttribute("data-exam-id");
            window.location.href = "takeExam.html?id=" + examId;
        });
    });
}