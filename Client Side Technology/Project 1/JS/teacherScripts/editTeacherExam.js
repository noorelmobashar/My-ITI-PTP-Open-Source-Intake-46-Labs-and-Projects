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
            <p>You do not have permission to edit this exam or the exam does not exist.</p>
            <hr>
            <p class="mb-0"><a href="teacherDashboard.html" class="alert-link">Return to Dashboard</a></p>
        </div>
    `;
} else {
    // start editing exam
    editExam(examId);
}

// make function to edit exam
function editExam(examId) {
    
    // find the exam object
    let exam = currentUser.createdExams.find(exam => exam.id === examId);

    // make students management section
    let studentsDiv = document.createElement("div");
    studentsDiv.id = "studentsDiv";
    studentsDiv.className = "row border-success border border-2 rounded p-3 mt-4 col-11 mx-auto";
    let studentsHeading = document.createElement("p");
    studentsHeading.className = "mt-3 fs-3 fw-bold";
    studentsHeading.innerText = `Manage Students for Exam: ${exam.examName}`;
    studentsDiv.appendChild(studentsHeading);

    // make table for students
    let studentsTable = document.createElement("table");
    studentsTable.className = "table table-bordered mt-4";

    // make table header
    let studentsTableHead = document.createElement("thead");
    let headRow = document.createElement("tr");
    let th1 = document.createElement("th");
    th1.innerText = "Student ID";
    let th2 = document.createElement("th");
    th2.innerText = "Student Name";
    let th3 = document.createElement("th");
    th3.innerText = "Score";
    let th4 = document.createElement("th");
    th4.innerText = "Actions";
    headRow.appendChild(th1);
    headRow.appendChild(th2);
    headRow.appendChild(th3);
    headRow.appendChild(th4);
    studentsTableHead.appendChild(headRow);
    studentsTable.appendChild(studentsTableHead);

    let studentsTableBody = document.createElement("tbody");

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
        // make remove button for enrolled student
        let deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-danger btn-sm";
        deleteBtn.innerText = "Remove";
        deleteBtn.addEventListener("click", () => {
            // remove student from exam
            currentUser.removeStudentFromExam(exam.id, student.id);
            let studentObj = students.find(s => s.id === student.id);
            studentObj.removeExam(exam.id);
            // save changes
            saveToLocalStorage("students", students);
            saveToLocalStorage("loggedInUser", currentUser);
            saveToLocalStorage("teachers", getFromLocalStorage("teachers").map(teacher => teacher.id === currentUser.id ? currentUser : teacher));
            window.location.reload();
        });
        td4.appendChild(deleteBtn);
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        row.appendChild(td4);
        studentsTableBody.appendChild(row);
    });

    // list other students to add them
    //add the rest of the students with add button
    students.forEach(student => {
        if(!exam.enrolledStudents.find(e => e.id === student.id)) {
            let row = document.createElement("tr");
            let td1 = document.createElement("td");
            td1.innerText = student.id;
            let td2 = document.createElement("td");
            td2.innerText = student.username;
            let td3 = document.createElement("td");
            td3.innerText = "N/A";
            let td4 = document.createElement("td");
            let addBtn = document.createElement("button");
            addBtn.className = "btn btn-success btn-sm";
            addBtn.innerText = "Add";
            addBtn.addEventListener("click", () => {
                // add student to exam
                currentUser.addStudentToExam(exam.id, student.id);
                let studentObj = students.find(s => s.id === student.id);
                studentObj.assignExam(exam.id, exam.examName);
                // save changes
                saveToLocalStorage("students", students);
                saveToLocalStorage("loggedInUser", currentUser);
                saveToLocalStorage("teachers", getFromLocalStorage("teachers").map(teacher => teacher.id === currentUser.id ? currentUser : teacher));
                window.location.reload();
            });
            td4.appendChild(addBtn);

            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);
            studentsTableBody.appendChild(row);
        }
    });

    studentsTable.appendChild(studentsTableBody);
    studentsDiv.appendChild(studentsTable);
    document.querySelector("#mainContainer").appendChild(studentsDiv);


    // make accordion for questions editing similar to view but with edit and delete buttons
    // and a button to add new question

    let questionsDiv = document.createElement("div");
    questionsDiv.className = "row border-primary border border-2 rounded p-3 mt-4 col-11 mx-auto";
    let questionsHeading = document.createElement("p");
    questionsHeading.className = "mt-3 fs-3 fw-bold";
    questionsHeading.innerText = `Questions for Exam: ${exam.examName}`;
    questionsDiv.appendChild(questionsHeading);

    //make an input to modify exam duration
    let durationDiv = document.createElement("div");
    durationDiv.className = "mb-3 row";
    let durationLabel = document.createElement("label");
    durationLabel.className = "col-sm-3 col-form-label fw-bold";
    durationLabel.innerText = "Exam Duration (mins):";
    let durationInputDiv = document.createElement("div");
    durationInputDiv.className = "col-sm-2";
    let durationInput = document.createElement("input");
    durationInput.type = "number";
    durationInput.min = "1";
    durationInput.value = exam.examDuration;
    durationInput.className = "form-control";
    durationInput.id = "examDurationInput";
    durationInputDiv.appendChild(durationInput);
    durationDiv.appendChild(durationLabel);
    durationDiv.appendChild(durationInputDiv);
    questionsDiv.appendChild(durationDiv);

    let accordionDiv = document.createElement("div");
    accordionDiv.className = "accordion";
    accordionDiv.id = "questionsAccordion";

    let uniqueIdCounter = exam.questions.length;

    // list existing questions
    exam.questions.forEach((question, index) => {
        let item = createQuestionAccordionItem(question, index, exam, false);
        accordionDiv.appendChild(item);
    });

    questionsDiv.appendChild(accordionDiv);

    // make button to add new question
    let addQuestionBtnDiv = document.createElement("div");
    addQuestionBtnDiv.className = "d-flex";
    let addQuestionBtn = document.createElement("button");
    addQuestionBtn.className = "btn btn-primary mt-3 text-white fw-bold";
    addQuestionBtn.innerText = "Add New Question";
    addQuestionBtn.addEventListener("click", () => {
        // create new empty question
        let newQuestion = {
            text: "",
            choices: ["", "", "", ""],
            correctAnswer: "",
            score: 1,
            image: null,
            difficultyLevel: "easy"
        };
        let item = createQuestionAccordionItem(newQuestion, uniqueIdCounter++, exam, true);
        accordionDiv.appendChild(item);
        
        // Open the new accordion item
        let collapse = item.querySelector(".accordion-collapse");
        let button = item.querySelector(".accordion-button");
        button.classList.remove("collapsed");
        button.setAttribute("aria-expanded", "true");
        collapse.classList.add("show");
    });
    addQuestionBtnDiv.appendChild(addQuestionBtn);
    questionsDiv.appendChild(addQuestionBtnDiv);

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

    // make save button
    let saveScoresDiv = document.createElement("div");
    saveScoresDiv.className = "row mt-2 mb-4";
    let saveScoresBtn = document.createElement("button");
    saveScoresBtn.className = "btn btn-success col-2 mx-auto";
    saveScoresBtn.innerText = "Save Changes";
    saveScoresBtn.addEventListener("click", () => {
        // prepare to collect questions
        let newQuestions = [];
        let totalScore = 0;
        let isValid = true;
        let accordionItems = accordionDiv.querySelectorAll(".accordion-item");

        // find max id to make new unique ids
        let maxId = exam.questions.reduce((max, q) => Math.max(max, q.id || 0), 0);

        // loop through all questions
        accordionItems.forEach((item) => {
            let qText = item.querySelector(".question-text").value;
            let qScore = parseInt(item.querySelector(".question-score").value);
            let qImage = item.querySelector(".question-image").src;
            let qDifficulty = item.querySelector(".question-difficulty").value;
            let qId = item.dataset.id ? parseInt(item.dataset.id) : ++maxId;
            
            let choices = [];
            let correctAnswer = "";
            let choiceInputs = item.querySelectorAll(".choice-input");
            let choiceRadios = item.querySelectorAll(".choice-radio");

            // collect choices
            choiceInputs.forEach((input, cIdx) => {
                choices.push(input.value);
                if (choiceRadios[cIdx].checked) {
                    correctAnswer = input.value;
                }
            });

            // check if question is valid
            if (!qText || choices.some(c => !c) || !correctAnswer || isNaN(qScore)) {
                isValid = false;
            }
            
            totalScore += qScore;

            // add question to list
            newQuestions.push({
                id: qId,
                text: qText,
                score: qScore,
                image: (qImage && !qImage.endsWith("null") && qImage !== window.location.href) ? qImage : null,
                choices: choices,
                correctAnswer: correctAnswer,
                difficultyLevel: qDifficulty
            });
            //check if any score is not in the specified range
            if(qScore < 1 || qScore > 100) {
                isValid = false;
            }
        });

        
        // show error if invalid
        if (!isValid) {
            alert("Please fill in all fields and select a correct answer for each question and ensure all scores are between 1 and 100.");
            return;
        }

        // check total score
        if (totalScore !== 100) {
            alert("Total score of all questions must equal 100. Current total: " + totalScore);
            return;
        }

        // check duration
        let newDuration = parseInt(document.getElementById("examDurationInput").value);
        if (newDuration < 1) {
            alert("Exam duration must be at least 1 minute.");
            return;
        }

        // check if questions changed
        let questionsChanged = false;
        let modifiedQuestionIds = [];

        // check if number of questions changed
        if (exam.questions.length !== newQuestions.length) {
            questionsChanged = true;
        }

        // check each question for changes
        newQuestions.forEach(newQ => {
            let oldQ = exam.questions.find(q => q.id === newQ.id);
            if (!oldQ) {
                // mark new question as changed
                questionsChanged = true;
                modifiedQuestionIds.push(newQ.id);
            } else {
                // check if text, answer, choices or image changed
                let contentChanged = (
                    newQ.text !== oldQ.text ||
                    newQ.correctAnswer !== oldQ.correctAnswer ||
                    JSON.stringify(newQ.choices) !== JSON.stringify(oldQ.choices) ||
                    newQ.image !== oldQ.image
                );
                if (contentChanged) {
                    questionsChanged = true;
                    modifiedQuestionIds.push(newQ.id);
                }
            }
        });

        // ask for confirmation
        let confirmMessage = "Do you want to save changes?";
        if (questionsChanged) {
            confirmMessage = "Note: Questions have been modified. Students will need to retake the modified portions of the exam. Proceed?";
        } else {
            confirmMessage = "Note: Only scores or duration changed. Student scores will be updated without retaking. Proceed?";
        }

        let confirmUpdate = confirm(confirmMessage);
        if (!confirmUpdate) {
            return;
        }

        // update exam data
        exam.questions = newQuestions;
        exam.examDuration = newDuration;
        currentUser.createdExams = currentUser.createdExams.map(e => e.id === exam.id ? exam : e);

        if (questionsChanged) {
            // reset progress for modified questions
            exam.enrolledStudents.forEach(enrollment => {
                let student = students.find(s => s.id === enrollment.id);
                
                // check if student started exam
                if (enrollment.answers) {
                    // remove answers for changed questions
                    modifiedQuestionIds.forEach(modId => {
                        delete enrollment.answers[modId];
                    });
                    
                    // remove answers for deleted questions
                    let currentQuestionIds = newQuestions.map(q => q.id);
                    Object.keys(enrollment.answers).forEach(ansId => {
                        if (!currentQuestionIds.includes(parseInt(ansId))) {
                            delete enrollment.answers[ansId];
                        }
                    });

                    // reset score
                    enrollment.score = null;

                    // move exam back to assigned list if it was completed
                    let completedIndex = student.completedExams.findIndex(e => e.id === exam.id);
                    if (completedIndex !== -1) {
                        student.completedExams.splice(completedIndex, 1);
                        student.assignExam(exam.id, exam.examName);
                    }
                }
            });
        } else {
            // recalculate scores if only scores changed
            exam.enrolledStudents.forEach(enrollment => {
                if (enrollment.answers && enrollment.score !== null) {
                    let newScore = 0;
                    newQuestions.forEach(q => {
                        if (enrollment.answers[q.id] === q.correctAnswer) {
                            newScore += q.score;
                        }
                    });
                    enrollment.score = newScore;

                    // update student object
                    let student = students.find(s => s.id === enrollment.id);
                    let completedExam = student.completedExams.find(e => e.id === exam.id);
                    if (completedExam) {
                        completedExam.score = newScore;
                    }
                }
            });
        }

        exam.enrolledStudents = exam.enrolledStudents.map(enrollment => {
            return enrollment;
        });

        // save everything
        saveToLocalStorage("loggedInUser", currentUser);
        saveToLocalStorage("teachers", getFromLocalStorage("teachers").map(teacher => teacher.id === currentUser.id ? currentUser : teacher));
        saveToLocalStorage("students", students);
        alert("Exam updated successfully!");
        window.location.reload();
    });
    saveScoresDiv.appendChild(saveScoresBtn);
    document.querySelector("#mainContainer").appendChild(saveScoresDiv);
    
}

// make function to create accordion item for question
function createQuestionAccordionItem(question, index, exam, isNew) {
    // make accordion item div
    let accordionItem = document.createElement("div");
    accordionItem.className = "accordion-item";
    if (question.id) {
        accordionItem.dataset.id = question.id;
    }

    // make header for accordion item
    let accordionHeader = document.createElement("h2");
    accordionHeader.className = "accordion-header";
    accordionHeader.id = `heading${index}`;

    // make button to toggle accordion item
    let accordionButton = document.createElement("button");
    accordionButton.className = "accordion-button collapsed";
    accordionButton.type = "button";
    accordionButton.setAttribute("data-bs-toggle", "collapse");
    accordionButton.setAttribute("data-bs-target", `#collapse${index}`);
    accordionButton.setAttribute("aria-expanded", "false");
    accordionButton.setAttribute("aria-controls", `collapse${index}`);
    
    // set question title
    let questionTitle = document.createElement("span");
    questionTitle.innerText = `Question ${index + 1}`;
    accordionButton.appendChild(questionTitle);

    // make score input inside header
    let scoreDiv = document.createElement("div");
    scoreDiv.className = "d-flex align-items-center ms-auto me-3";
    scoreDiv.addEventListener("click", (e) => e.stopPropagation());

    let scoreLabel = document.createElement("label");
    scoreLabel.innerText = "Score: ";
    scoreLabel.className = "me-2 mb-0";
    
    let scoreInput = document.createElement("input");
    scoreInput.type = "number";
    scoreInput.min = "1";
    scoreInput.max = "100";
    scoreInput.value = question.score;
    scoreInput.className = "form-control form-control-sm question-score";
    scoreInput.style.width = "80px";
    
    scoreDiv.appendChild(scoreLabel);
    scoreDiv.appendChild(scoreInput);
    accordionButton.appendChild(scoreDiv);

    accordionHeader.appendChild(accordionButton);
    accordionItem.appendChild(accordionHeader);

    // make body for accordion item
    let accordionCollapse = document.createElement("div");
    accordionCollapse.id = `collapse${index}`;
    accordionCollapse.className = "accordion-collapse collapse";
    accordionCollapse.setAttribute("aria-labelledby", `heading${index}`);
    accordionCollapse.setAttribute("data-bs-parent", "#questionsAccordion");

    let accordionBody = document.createElement("div");
    accordionBody.className = "accordion-body";

    // make input for question text
    let questionText = document.createElement("input");
    questionText.value = question.text;
    questionText.className = "fw-bold mb-3 form-control question-text";
    questionText.placeholder = "Enter Question Text";
    accordionBody.appendChild(questionText);

    // show question image if exists
    let questionImage = document.createElement("img");
    questionImage.src = (question.image !== null && !question.image.endsWith("null") ? question.image : "");
    questionImage.className = "img-fluid mb-3 question-image";
    questionImage.style.display = (question.image !== null && !question.image.endsWith("null") ? "block" : "none");
    accordionBody.appendChild(questionImage);

    // make input to upload image
    let changeImageBtn = document.createElement("input");
    changeImageBtn.type = "file";
    changeImageBtn.className = "form-control mb-3";
    
    let imgFeedback = document.createElement("div");
    imgFeedback.className = "valid-feedback mb-3";
    
    // handle image upload
    changeImageBtn.addEventListener("change", async function() {
        imgFeedback.style.display = "flex";
        imgFeedback.innerText = "Uploading image, please wait...";
        try {
            let newImageURL = await uploadStudentImage(this.files[0]);
            questionImage.src = newImageURL;
            imgFeedback.innerText = "Image uploaded successfully!";
            questionImage.style.display = "block";
        } catch (e) {
            imgFeedback.innerText = "Error uploading image.";
            imgFeedback.className = "invalid-feedback mb-3";
            imgFeedback.style.display = "flex";
        }
    });

    accordionBody.appendChild(changeImageBtn);
    accordionBody.appendChild(imgFeedback);

    // make list for choices
    let choicesList = document.createElement("ul");
    choicesList.className = "list-group";

    // ensure there are 4 choices
    let choices = question.choices || ["", "", "", ""];
    while(choices.length < 4) choices.push("");

    // loop to create choice inputs
    choices.forEach((choice, cIndex) => {
        let choiceItem = document.createElement("li");
        choiceItem.className = "list-group-item d-flex justify-content-between align-items-center";
        let choiceInput = document.createElement("input");
        choiceInput.type = "text";
        choiceInput.value = choice;
        choiceInput.className = "form-control me-3 choice-input";
        choiceInput.placeholder = `Choice ${cIndex + 1}`;
        
        // make radio button for correct answer
        let correctAnswerRadio = document.createElement("input");
        correctAnswerRadio.type = "radio";
        correctAnswerRadio.name = `correctAnswer${index}`;
        correctAnswerRadio.className = "form-check-input choice-radio";
        
        // check if this choice is correct answer
        if(choice === question.correctAnswer && choice !== "") {
            correctAnswerRadio.checked = true;
            choiceItem.classList.add("border", "border-3", "border-success", "rounded");
        }
        
        // highlight correct answer when selected
        correctAnswerRadio.addEventListener("change", function() {
            choicesList.querySelectorAll("li").forEach(li => li.classList.remove("border", "border-3", "border-success", "rounded"));
            choiceItem.classList.add("border", "border-3", "border-success", "rounded");
        });
        
        choiceItem.appendChild(choiceInput);
        choiceItem.appendChild(correctAnswerRadio);
        choicesList.appendChild(choiceItem);
    });

    // make difficulty level selector
    let difficultyLabel = document.createElement("label");
    difficultyLabel.className = "form-label mt-3";
    difficultyLabel.innerText = "Difficulty Level:";
    accordionBody.appendChild(difficultyLabel);

    let difficultySelect = document.createElement("select");
    difficultySelect.className = "form-select mb-3 question-difficulty";
    let easyOption = document.createElement("option");
    easyOption.value = "easy";
    easyOption.innerText = "Easy";
    let middleOption = document.createElement("option");
    middleOption.value = "middle";
    middleOption.innerText = "Middle";
    let hardOption = document.createElement("option");
    hardOption.value = "hard";
    hardOption.innerText = "Hard";

    difficultySelect.appendChild(easyOption);
    difficultySelect.appendChild(middleOption);
    difficultySelect.appendChild(hardOption);
    difficultySelect.value = question.difficultyLevel;
    accordionBody.appendChild(difficultySelect);
    accordionBody.appendChild(choicesList);

    // make delete button for question
    let deleteQuestionBtn = document.createElement("button");
    deleteQuestionBtn.className = "btn btn-danger mt-3";
    deleteQuestionBtn.innerText = "Delete Question";
    deleteQuestionBtn.addEventListener("click", () => {
        if (isNew) {
            // remove new question directly
            accordionItem.remove();
        } else {
            // check if exam has enough questions
            if(exam.questions.length <= 15) {
                alert("Cannot delete question. An exam must have at least 15 questions.");
                return;
            }
            // confirm deletion
            let confirmDelete = confirm("Are you sure you want to delete this question?");
            if(confirmDelete) {
                // redistribute score of deleted question
                let deletedQuestionScore = question.score;
                let remainingQuestions = exam.questions.filter((q, i) => i !== index);
                let totalRemainingScore = 100 - deletedQuestionScore;
                remainingQuestions.forEach(q => {
                    q.score += (q.score / totalRemainingScore) * deletedQuestionScore;
                    q.score = Math.round(q.score);
                });
                // remove question from exam
                exam.questions.splice(index, 1);
                currentUser.createdExams = currentUser.createdExams.map(e => e.id === exam.id ? exam : e);
                // save changes
                saveToLocalStorage("loggedInUser", currentUser);
                saveToLocalStorage("teachers", getFromLocalStorage("teachers").map(teacher => teacher.id === currentUser.id ? currentUser : teacher));
                alert("Question deleted successfully!");
                window.location.reload();
            }
        }
    });
    accordionBody.appendChild(deleteQuestionBtn);

    accordionCollapse.appendChild(accordionBody);
    accordionItem.appendChild(accordionCollapse);

    return accordionItem;
}