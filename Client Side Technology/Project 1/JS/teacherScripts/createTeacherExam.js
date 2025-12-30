// check if user is logged in
checkLoggedInUser();

// get current user data
let currentUserData = getFromLocalStorage("loggedInUser");
let currentUser = new Teacher(currentUserData);
let navProfilePic = document.querySelector("#navProfilePic");
navProfilePic.src = currentUser.profilePicture;

// create exam ui here
createExamUI();

function createExamUI() {
    
    let mainContainer = document.querySelector("#mainContainer");
    mainContainer.innerHTML = ""; // Clear container

    let header = document.createElement("h2");
    header.className = "mb-4 text-center";
    header.innerText = "Create New Exam";
    mainContainer.appendChild(header);

    // create exam name input
    let nameDiv = document.createElement("div");
    nameDiv.className = "mb-3 row";
    let nameLabel = document.createElement("label");
    nameLabel.className = "col-sm-3 col-form-label fw-bold";
    nameLabel.innerText = "Exam Name:";
    let nameInputDiv = document.createElement("div");
    nameInputDiv.className = "col-sm-9";
    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "form-control";
    nameInput.id = "examNameInput";
    nameInput.placeholder = "Enter Exam Name";
    nameInputDiv.appendChild(nameInput);
    nameDiv.appendChild(nameLabel);
    nameDiv.appendChild(nameInputDiv);
    mainContainer.appendChild(nameDiv);

    // create exam duration input
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
    durationInput.value = 60; // Default value
    durationInput.className = "form-control";
    durationInput.id = "examDurationInput";
    durationInputDiv.appendChild(durationInput);
    durationDiv.appendChild(durationLabel);
    durationDiv.appendChild(durationInputDiv);
    mainContainer.appendChild(durationDiv);

    // make questions section div
    let questionsDiv = document.createElement("div");
    questionsDiv.className = "row border-primary border border-2 rounded p-3 mt-4 col-12 mx-auto";
    let questionsHeading = document.createElement("p");
    questionsHeading.className = "mt-3 fs-3 fw-bold";
    questionsHeading.innerText = "Questions";
    questionsDiv.appendChild(questionsHeading);

    // make accordion for questions list
    let accordionDiv = document.createElement("div");
    accordionDiv.className = "accordion";
    accordionDiv.id = "questionsAccordion";

    // make first empty question
    let initialQuestion = {
        text: "",
        choices: ["", "", "", ""],
        correctAnswer: "",
        score: 10,
        image: null,
        difficultyLevel: "easy"
    };
    
    // put question in list to save later
    let currentQuestions = [initialQuestion];
    let uniqueIdCounter = 1;

    // make accordion item for question
    let item = createQuestionAccordionItem(initialQuestion, 0, currentQuestions, true);
    accordionDiv.appendChild(item);
    
    // open the first question so teacher see it
    let collapse = item.querySelector(".accordion-collapse");
    let button = item.querySelector(".accordion-button");
    button.classList.remove("collapsed");
    button.setAttribute("aria-expanded", "true");
    collapse.classList.add("show");

    questionsDiv.appendChild(accordionDiv);

    // make button to add more questions
    let addQuestionBtnDiv = document.createElement("div");
    addQuestionBtnDiv.className = "d-flex";
    let addQuestionBtn = document.createElement("button");
    addQuestionBtn.className = "btn btn-primary mt-3 text-white fw-bold";
    addQuestionBtn.innerText = "Add New Question";
    addQuestionBtn.addEventListener("click", () => {
        // make new empty question object
        let newQuestion = {
            text: "",
            choices: ["", "", "", ""],
            correctAnswer: "",
            score: 1,
            image: null,
            difficultyLevel: "easy"
        };
        currentQuestions.push(newQuestion);
        // add new question to accordion
        let item = createQuestionAccordionItem(newQuestion, currentQuestions.length - 1, currentQuestions, true);
        accordionDiv.appendChild(item);
        
        // open the new question and close others
        let collapse = item.querySelector(".accordion-collapse");
        let button = item.querySelector(".accordion-button");
        accordionDiv.querySelectorAll(".accordion-button").forEach(btn => {
            btn.classList.add("collapsed");
            btn.setAttribute("aria-expanded", "false");
        });
        accordionDiv.querySelectorAll(".accordion-collapse").forEach(col => {
            col.classList.remove("show");
        });

        button.classList.remove("collapsed");
        button.setAttribute("aria-expanded", "true");
        collapse.classList.add("show");
    });
    addQuestionBtnDiv.appendChild(addQuestionBtn);
    questionsDiv.appendChild(addQuestionBtnDiv);

    mainContainer.appendChild(questionsDiv);

    // make buttons div
    let buttonsDiv = document.createElement("div");
    buttonsDiv.className = "row mt-4 mb-4 justify-content-center";
    
    // make back button to go to dashboard
    let backButton = document.createElement("button");
    backButton.className = "btn btn-secondary col-2 mx-2";
    backButton.innerText = "Back to Dashboard";
    backButton.addEventListener("click", () => {
        window.location.href = "teacherDashboard.html";
    });
    buttonsDiv.appendChild(backButton);

    // make create exam button
    let createBtn = document.createElement("button");
    createBtn.className = "btn btn-success col-2 mx-2";
    createBtn.innerText = "Create Exam";
    createBtn.addEventListener("click", () => {
        // get exam name and duration
        let examName = document.getElementById("examNameInput").value;
        let examDuration = parseInt(document.getElementById("examDurationInput").value);
        
        // check if name is empty
        if (!examName) {
            alert("Please enter an exam name.");
            return;
        }
        // check if duration is valid
        if (isNaN(examDuration) || examDuration < 1) {
            alert("Exam duration must be at least 1 minute.");
            return;
        }

        // prepare to collect all questions
        let newQuestions = [];
        let totalScore = 0;
        let isValid = true;
        let accordionItems = accordionDiv.querySelectorAll(".accordion-item");

        // loop through all question items
        accordionItems.forEach((item) => {
            let qText = item.querySelector(".question-text").value;
            let qScore = parseInt(item.querySelector(".question-score").value);
            let qImage = item.querySelector(".question-image").src;
            let qDifficulty = item.querySelector(".question-difficulty").value;
            
            let choices = [];
            let correctAnswer = "";
            let choiceInputs = item.querySelectorAll(".choice-input");
            let choiceRadios = item.querySelectorAll(".choice-radio");

            // collect choices and find correct answer
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

        // show error if something is missing
        if (!isValid) {
            alert("Please fill in all fields and select a correct answer for each question and ensure all scores are between 1 and 100.");
            return;
        }

        // check if there are enough questions
        if (newQuestions.length < 15) {
            alert(`You must have at least 15 questions. Currently you have ${newQuestions.length}.`);
            return;
        }

        // check if total score is 100
        if (totalScore !== 100) {
            alert("Total score of all questions must equal 100. Current total: " + totalScore);
            return;
        }

        try {
            // save the new exam
            currentUser.createNewExam(examName, examDuration, newQuestions, examDuration); 

            // update local storage
            saveToLocalStorage("loggedInUser", currentUser);
            saveToLocalStorage("teachers", getFromLocalStorage("teachers").map(teacher => teacher.id === currentUser.id ? currentUser : teacher));
            
            alert("Exam created successfully!");
            window.location.href = "teacherDashboard.html";
        } catch (error) {
            alert("Error creating exam: " + error.message);
        }
    });
    buttonsDiv.appendChild(createBtn);

    mainContainer.appendChild(buttonsDiv);
}

// make function to create accordion item for question
function createQuestionAccordionItem(question, index, questionsArray, isNew) {
    // make accordion item div
    let accordionItem = document.createElement("div");
    accordionItem.className = "accordion-item";

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

        // check if it is the last question
        if (document.getElementById("questionsAccordion").children.length <= 1) {
             alert("You must have at least one question.");
             return;
        }

        // confirm deletion
        let confirmDelete = confirm("Are you sure you want to delete this question?");
        if(confirmDelete) {
            accordionItem.remove();
        }
    });
    accordionBody.appendChild(deleteQuestionBtn);

    accordionCollapse.appendChild(accordionBody);
    accordionItem.appendChild(accordionCollapse);

    return accordionItem;
}
