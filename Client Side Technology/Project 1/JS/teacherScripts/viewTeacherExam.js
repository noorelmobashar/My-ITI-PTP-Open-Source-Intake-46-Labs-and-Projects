// check if user is logged in
checkLoggedInUser();

// get current user and students data
let currentUserData = getFromLocalStorage("loggedInUser");
let currentUser = new Teacher(currentUserData);
let studentsData = getFromLocalStorage("students");
let students = studentsData.map(studentData => new Student(studentData));
let navProfilePic = document.querySelector("#navProfilePic");
navProfilePic.src = currentUser.profilePicture;

// get exam id from url
const urlParams = new URLSearchParams(window.location.search);
const examId = parseInt(urlParams.get('id'));

// check if exam exists and belongs to teacher
if (!examId || !currentUser.createdExams.find(e => e.id === examId)) {
    document.querySelector("#mainContainer").innerHTML = `
        <div class="alert alert-danger text-center mt-5" role="alert">
            <h4 class="alert-heading">Access Denied</h4>
            <p>You do not have permission to view this exam or the exam does not exist.</p>
            <hr>
            <p class="mb-0"><a href="teacherDashboard.html" class="alert-link">Return to Dashboard</a></p>
        </div>
    `;
} else {
    viewExam(examId);
}

// make function to view exam
function viewExam(examId) {
    let exam = currentUser.createdExams.find(exam => exam.id === examId);

    //create new div to show enrolled students in a table
    let enrolledStudentsDiv = document.createElement("div");
    enrolledStudentsDiv.id = "enrolledStudentsDiv";
    enrolledStudentsDiv.className = "row border-success border border-2 rounded p-3 mt-4 col-11 mx-auto";
    let enrolledStudentsHeading = document.createElement("p");
    enrolledStudentsHeading.className = "mt-3 fs-3 fw-bold";
    enrolledStudentsHeading.innerText = `Enrolled Students for Exam: ${exam.examName}`;
    enrolledStudentsDiv.appendChild(enrolledStudentsHeading);

    // make table for enrolled students
    let enrolledStudentsTable = document.createElement("table");
    enrolledStudentsTable.className = "table table-bordered mt-4";

    // make table header
    let enrolledStudentsTableHead = document.createElement("thead");
    let headRow = document.createElement("tr");
    let th1 = document.createElement("th");
    th1.innerText = "Student ID";
    let th2 = document.createElement("th");
    th2.innerText = "Student Name";
    let th3 = document.createElement("th");
    th3.innerText = "Score";
    let th4 = document.createElement("th");
    th4.innerText = "Action";
    
    headRow.appendChild(th1);
    headRow.appendChild(th2);
    headRow.appendChild(th3);
    headRow.appendChild(th4);
    enrolledStudentsTableHead.appendChild(headRow);
    enrolledStudentsTable.appendChild(enrolledStudentsTableHead);

    let enrolledStudentsTableBody = document.createElement("tbody");

    // check if there are enrolled students
    if(exam.enrolledStudents.length === 0) {
        let row = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = 4;
        td.className = "text-center";
        td.innerText = "No students have enrolled in this exam yet.";
        row.appendChild(td);
        enrolledStudentsTableBody.appendChild(row);
    }
    else
    {
        // list enrolled students
        exam.enrolledStudents.forEach(enrollment => {
            let student = students.find(s => s.id === enrollment.id);
            let row = document.createElement("tr");
            let td1 = document.createElement("td");
            td1.innerText = student.id;
            let td2 = document.createElement("td");
            td2.innerText = student.username;
            let td3 = document.createElement("td");
            td3.innerText = enrollment.score !== null ? enrollment.score : "Not Taken";
            let td4 = document.createElement("td");
            // add review button if student took exam
            if (enrollment.score !== null) {
                let reviewBtn = document.createElement("button");
                reviewBtn.className = "btn btn-primary btn-sm";
                reviewBtn.innerText = "Review";
                reviewBtn.addEventListener("click", () => showReviewModal(student, enrollment, exam));
                td4.appendChild(reviewBtn);
            } else {
                td4.innerText = "-";
            }

            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);
            enrolledStudentsTableBody.appendChild(row);
        });
    }
    
    enrolledStudentsTable.appendChild(enrolledStudentsTableBody);
    enrolledStudentsDiv.appendChild(enrolledStudentsTable);
    document.querySelector("#mainContainer").appendChild(enrolledStudentsDiv);
    

    // view questions of the exam with choices and correct answers using accordion in bootstrap
    let questionsDiv = document.createElement("div");
    questionsDiv.className = "row border-primary border border-2 rounded p-3 mt-4 col-11 mx-auto";
    let questionsHeading = document.createElement("p");
    questionsHeading.className = "mt-3 fs-3 fw-bold";
    questionsHeading.innerText = `Questions for Exam: ${exam.examName}`;
    questionsDiv.appendChild(questionsHeading);

    let accordionDiv = document.createElement("div");
    accordionDiv.className = "accordion";
    accordionDiv.id = "questionsAccordion";

    // loop on questions to show them
    exam.questions.forEach((question, index) => {

        let accordionItem = document.createElement("div");
        accordionItem.className = "accordion-item";

        let accordionHeader = document.createElement("h2");
        accordionHeader.className = "accordion-header";
        accordionHeader.id = `heading${index}`;

        let accordionButton = document.createElement("button");
        accordionButton.className = "accordion-button collapsed";
        accordionButton.type = "button";
        accordionButton.setAttribute("data-bs-toggle", "collapse");
        accordionButton.setAttribute("data-bs-target", `#collapse${index}`);
        accordionButton.setAttribute("aria-expanded", "false");
        accordionButton.setAttribute("aria-controls", `collapse${index}`);
        accordionButton.innerText = `Question ${index + 1}`;

        accordionHeader.appendChild(accordionButton);
        accordionItem.appendChild(accordionHeader);

        let accordionCollapse = document.createElement("div");
        accordionCollapse.id = `collapse${index}`;
        accordionCollapse.className = "accordion-collapse collapse";
        accordionCollapse.setAttribute("aria-labelledby", `heading${index}`);
        accordionCollapse.setAttribute("data-bs-parent", "#questionsAccordion");

        let accordionBody = document.createElement("div");
        accordionBody.className = "accordion-body";

        //make answers centered in a rounded borders with a success border for the correct answer
        let questionText = document.createElement("p");
        questionText.innerText = question.text;
        questionText.className = "fw-bold";
        accordionBody.appendChild(questionText);

        // show question image if exists
        if(question.image) {
            let questionImage = document.createElement("img");
            questionImage.src = question.image;
            questionImage.className = "img-fluid mb-3";
            accordionBody.appendChild(questionImage);
        }

        // show choices and highlight correct one
        let choicesList = document.createElement("ul");
        choicesList.className = "list-group";
        question.choices.forEach((choice, choiceIndex) => {
            let choiceItem = document.createElement("li");
            choiceItem.className = "list-group-item";
            if(choice === question.correctAnswer) {
                choiceItem.classList.add("border", "border-3", "border-success", "rounded");
            }
            choiceItem.innerText = choice;
            choicesList.appendChild(choiceItem);
        });

        accordionBody.appendChild(choicesList);
        accordionCollapse.appendChild(accordionBody);
        accordionItem.appendChild(accordionCollapse);
        accordionDiv.appendChild(accordionItem);
    });

    questionsDiv.appendChild(accordionDiv);
    document.querySelector("#mainContainer").appendChild(questionsDiv);

    //make a back button to go back to the main dashboard
    let backButtonDiv = document.createElement("div");
    backButtonDiv.className = "row mt-4 mb-2";
    let backButton = document.createElement("button");
    backButton.className = "btn btn-secondary col-2 mx-auto";
    backButton.innerText = "Back to Dashboard";
    backButton.addEventListener("click", () => {
        window.location.href = "teacherDashboard.html";
    });
    backButtonDiv.appendChild(backButton);
    document.querySelector("#mainContainer").appendChild(backButtonDiv);
}

// make modal for reviewing student answers
function createReviewModal() {
    if (document.getElementById("reviewModal")) return;

    let modalHtml = `
    <div class="modal fade" id="reviewModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="reviewModalLabel">Exam Review</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="reviewModalBody">
            <!-- Content goes here -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// show review modal with student answers
function showReviewModal(student, enrollment, exam) {
    createReviewModal();
    let modalBody = document.getElementById("reviewModalBody");
    document.getElementById("reviewModalLabel").innerText = `Review: ${student.username} - ${exam.examName}`;
    
    modalBody.innerHTML = "";
    
    if (!enrollment.answers) {
        modalBody.innerHTML = "<p class='text-danger text-center'>No detailed answers available for this student (Exam taken before update).</p>";
    } else {
        // loop on questions to show student answers
        exam.questions.forEach((q, index) => {
            let studentAnswer = enrollment.answers[q.id];
            let isCorrect = studentAnswer === q.correctAnswer;
            let cardClass = isCorrect ? "border-success" : "border-danger";
            let badgeClass = isCorrect ? "bg-success" : "bg-danger";
            let badgeText = isCorrect ? "Correct" : "Incorrect";
            
            let html = `
            <div class="card mb-3 ${cardClass}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span class="fw-bold">Question ${index + 1}</span>
                    <span class="badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="card-body">
                    <p class="card-text fw-bold">${q.text}</p>
                    ${q.image ? `<img src="${q.image}" class="img-fluid mb-2 rounded" style="max-height: 200px;">` : ''}
                    <ul class="list-group">
                        ${q.choices.map(choice => {
                            let itemClass = "";
                            if (choice === q.correctAnswer) itemClass = "list-group-item-success";
                            else if (choice === studentAnswer) itemClass = "list-group-item-danger";
                            
                            let checked = choice === studentAnswer ? "checked" : "";
                            
                            return `<li class="list-group-item ${itemClass}">
                                <input class="form-check-input me-2" type="radio" disabled ${checked}> ${choice}
                                ${choice === q.correctAnswer ? '<span class="badge bg-success float-end">Correct Answer</span>' : ''}
                                ${choice === studentAnswer && !isCorrect ? '<span class="badge bg-danger float-end">Student Answer</span>' : ''}
                            </li>`;
                        }).join('')}
                    </ul>
                </div>
            </div>`;
            modalBody.insertAdjacentHTML('beforeend', html);
        });
    }
    
    // show the modal
    let reviewModal = new bootstrap.Modal(document.getElementById('reviewModal'));
    reviewModal.show();

}
