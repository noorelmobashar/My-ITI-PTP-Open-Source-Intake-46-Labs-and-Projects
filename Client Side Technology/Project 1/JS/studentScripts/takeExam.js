// check if user is logged in
checkLoggedInUser();

//  get current user data
let currentUserData = getFromLocalStorage("loggedInUser");
let currentUser = new Student(currentUserData);
let navProfilePic = document.querySelector("#navProfilePic");
navProfilePic.src = currentUser.profilePicture;

//  get exam id from url
const urlParams = new URLSearchParams(window.location.search);
const examId = parseInt(urlParams.get('id'));

let exam = null;
let teachers = getFromLocalStorage("teachers");

// find the exam in teachers data
for (let teacher of teachers) {
    if (teacher.createdExams) {
        let found = teacher.createdExams.find(e => e.id === examId);
        if (found) {
            exam = found;
            break;
        }
    }
}

if (!exam) {
    alert("Exam not found!");
    window.location.href = "studentDashboard.html";
}

// check if student already took the exam
if (currentUser.completedExams.find(e => e.id === examId)) {
    alert("You have already taken this exam.");
    window.location.href = "studentDashboard.html";
}

let currentQuestionIndex = 0;
let userAnswers = {}; 
let shuffledQuestions = [];
let globalTimerInterval;
let questionTimerInterval;
let globalTimeRemaining = 0; 
let questionTimeRemaining = 0; 
let session = null;


// shuffle questions here
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getDifficultyWeight(level) {
    switch(level) {
        case 'easy': return 1;
        case 'middle': return 1.5;
        case 'hard': return 2;
        default: return 1;
    }
}

// calculate time for each question based on difficulty
function calculateQuestionTimes(questions, totalDurationMinutes) {
    let totalWeight = questions.reduce((sum, q) => sum + getDifficultyWeight(q.difficultyLevel), 0);
    let totalSeconds = totalDurationMinutes * 60;
    let baseUnit = totalSeconds / totalWeight;
    
    return questions.map(q => ({
        ...q,
        timeLimit: Math.floor(baseUnit * getDifficultyWeight(q.difficultyLevel))
    }));
}

// initialize exam here
function initExam() {
    document.getElementById("examTitle").innerText = exam.examName;
    
    //  check if there is an active session
    let storedSession = getFromLocalStorage("activeExamSession");
    
    if (storedSession && storedSession.userId === currentUser.id && storedSession.examId === exam.id) {
        //  restore session if exists
        session = storedSession;
        shuffledQuestions = session.questions;
        currentQuestionIndex = session.currentIndex;
        userAnswers = session.answers;
        
        let elapsedSeconds = Math.floor((Date.now() - session.startTime) / 1000);
        globalTimeRemaining = (exam.examDuration * 60) - elapsedSeconds;
        
    } else {
        // start new session if not
        // check for existing answers if retaking
        let enrollment = exam.enrolledStudents.find(s => s.id === currentUser.id);
        let existingAnswers = (enrollment && enrollment.answers) ? enrollment.answers : {};
        userAnswers = {...existingAnswers}; 

        let allQuestions = JSON.parse(JSON.stringify(exam.questions));

        if (allQuestions.some(q => q.id === undefined || q.id === null)) {
            alert("Error: This exam data is corrupted (missing question IDs). Please contact your teacher to edit and save the exam again.");
            window.location.href = "studentDashboard.html";
            return;
        }

        // calculate time limits for all questions
        let allQuestionsWithTime = calculateQuestionTimes(allQuestions, exam.examDuration);

        // filter questions that need to be answered
        let qs = allQuestionsWithTime.filter(q => !existingAnswers.hasOwnProperty(q.id));

        // check if all questions are answered
        if (qs.length === 0) {
            // All questions answered, just submit to update score
            shuffledQuestions = []; // No questions to show
            // need to set session to avoid errors if reloaded
             session = {
                userId: currentUser.id,
                examId: exam.id,
                startTime: Date.now(),
                currentQuestionStartTime: Date.now(),
                questions: [],
                currentIndex: 0,
                answers: existingAnswers
            };
            saveToLocalStorage("activeExamSession", session);
            // submit exam if all questions answered
            submitExam();
            return;
        }

        // shuffle questions and choices
        qs = shuffleArray(qs);
        qs.forEach(q => shuffleArray(q.choices));
        
        // Questions already have time limits calculated
        shuffledQuestions = qs;
        
        // create new session
        session = {
            userId: currentUser.id,
            examId: exam.id,
            startTime: Date.now(),
            currentQuestionStartTime: Date.now(),
            questions: shuffledQuestions,
            currentIndex: 0,
            answers: existingAnswers
        };
        
        // Global time is the sum of time limits of the questions to be answered
        globalTimeRemaining = shuffledQuestions.reduce((sum, q) => sum + q.timeLimit, 0);
        // save session to local storage
        saveToLocalStorage("activeExamSession", session);
    }

    if (globalTimeRemaining <= 0) {
        alert("Exam time has expired!");
        submitExam();
        return;
    }

    document.getElementById("totalQuestionsNum").innerText = shuffledQuestions.length;
    
    renderQuestions();
    startGlobalTimer();
    loadQuestion(currentQuestionIndex);
}

// --- Rendering ---

// render questions here
function renderQuestions() {
    let container = document.getElementById("questionsContainer");
    container.innerHTML = "";

    shuffledQuestions.forEach((q, index) => {
        let card = document.createElement("div");
        card.className = `card question-card`;
        card.id = `question-card-${index}`;
        card.style.display = "none"; // Hide all initially
        
        let cardBody = document.createElement("div");
        cardBody.className = "card-body";

        let qTitle = document.createElement("h5");
        qTitle.className = "card-title mb-3 d-flex justify-content-between";
        qTitle.innerHTML = `<span>Question ${index + 1}</span> <span class="badge bg-info">${q.difficultyLevel}</span>`;
        cardBody.appendChild(qTitle);

        let qText = document.createElement("p");
        qText.className = "card-text fs-5";
        qText.innerText = q.text;
        cardBody.appendChild(qText);

        if (q.image) {
            let img = document.createElement("img");
            img.src = q.image;
            img.className = "img-fluid mb-3 rounded";
            img.style.maxHeight = "300px";
            cardBody.appendChild(img);
        }

        let choicesDiv = document.createElement("div");
        choicesDiv.className = "list-group";
        choicesDiv.id = `choices-${index}`;
        
        q.choices.forEach(choice => {
            let label = document.createElement("label");
            label.className = "list-group-item list-group-item-action d-flex align-items-center cursor-pointer choice-label";
            label.dataset.choice = choice;
            
            let radio = document.createElement("input");
            radio.type = "radio";
            radio.name = `question-${q.id}`;
            radio.value = choice;
            radio.className = "form-check-input me-3";
            radio.disabled = false; // Enabled initially
            
            // If already answered (restored session), apply styles
            if (userAnswers[q.id]) {
                radio.disabled = true;
                if (choice === userAnswers[q.id]) {
                    radio.checked = true;
                    if (choice === q.correctAnswer) {
                        label.classList.add("list-group-item-success");
                    } else {
                        label.classList.add("list-group-item-danger");
                    }
                }
                if (choice === q.correctAnswer) {
                    label.classList.add("list-group-item-success"); // Highlight correct answer
                }
            }

            // Click Handler for Immediate Submission
            radio.addEventListener("change", () => handleAnswerSubmission(q, choice, index));

            label.appendChild(radio);
            label.appendChild(document.createTextNode(choice));
            choicesDiv.appendChild(label);
        });

        cardBody.appendChild(choicesDiv);
        card.appendChild(cardBody);
        container.appendChild(card);
    });
}

// load question by index
function loadQuestion(index) {
    // Hide all cards
    document.querySelectorAll(".question-card").forEach(c => c.style.display = "none");
    
    // Show current card
    let currentCard = document.getElementById(`question-card-${index}`);
    if (currentCard) {
        currentCard.style.display = "block";
    }

    // Update Navigation
    document.getElementById("currentQuestionNum").innerText = index + 1;
    document.getElementById("prevBtn").disabled = true; 
    document.getElementById("prevBtn").style.display = "none"; 

    let nextBtn = document.getElementById("nextBtn");
    let submitBtn = document.getElementById("submitBtn");

    if (index === shuffledQuestions.length - 1) {
        nextBtn.style.display = "none";
        submitBtn.style.display = "block";
        submitBtn.disabled = !userAnswers[shuffledQuestions[index].id]; // Disable until answered
    } else {
        nextBtn.style.display = "block";
        submitBtn.style.display = "none";
        nextBtn.disabled = !userAnswers[shuffledQuestions[index].id]; // Disable until answered
    }

    // Start Question Timer if not already answered
    if (!userAnswers[shuffledQuestions[index].id]) {
        startQuestionTimer(shuffledQuestions[index].timeLimit);
    } else {
        document.getElementById("qTimer").innerText = "Done";
    }
}

// --- Logic & Handlers ---

// handle answer submission here
function handleAnswerSubmission(question, selectedChoice, index) {
    // Stop Question Timer
    clearInterval(questionTimerInterval);
    
    // Save Answer
    userAnswers[question.id] = selectedChoice;
    session.answers = userAnswers;
    saveToLocalStorage("activeExamSession", session);

    // UI Feedback
    let choicesDiv = document.getElementById(`choices-${index}`);
    let labels = choicesDiv.querySelectorAll(".choice-label");
    
    labels.forEach(label => {
        let radio = label.querySelector("input");
        radio.disabled = true; // Disable all inputs
        
        let choiceVal = label.dataset.choice;
        
        if (choiceVal === selectedChoice) {
            if (choiceVal === question.correctAnswer) {
                label.classList.add("list-group-item-success");
            } else {
                label.classList.add("list-group-item-danger");
            }
        }
        
        if (choiceVal === question.correctAnswer) {
            label.classList.add("list-group-item-success"); // Always highlight correct
        }
    });

    // Enable Next/Submit Button
    if (index === shuffledQuestions.length - 1) {
        document.getElementById("submitBtn").disabled = false;
    } else {
        document.getElementById("nextBtn").disabled = false;
    }
}

// start global timer here
function startGlobalTimer() {
    let timerDisplay = document.getElementById("timer");
    
    function updateDisplay() {
        let minutes = Math.floor(globalTimeRemaining / 60);
        let seconds = globalTimeRemaining % 60;
        timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (globalTimeRemaining <= 300) { 
            document.getElementById("timerDiv").classList.add("bg-danger", "text-white");
            document.getElementById("timerDiv").classList.remove("text-danger", "bg-white");
        }
    }

    updateDisplay();
    
    globalTimerInterval = setInterval(() => {
        globalTimeRemaining--;
        updateDisplay();
        
        if (globalTimeRemaining <= 0) {
            clearInterval(globalTimerInterval);
            clearInterval(questionTimerInterval);
            alert("Exam time is up! Submitting...");
            submitExam();
        }
    }, 1000);
}

// start question timer here
function startQuestionTimer(duration) {
    
    // Ensure we have a start time for the current question
    if (!session.currentQuestionStartTime) {
        session.currentQuestionStartTime = Date.now();
        saveToLocalStorage("activeExamSession", session);
    }

    // Calculate remaining time based on elapsed time since question started
    let elapsedSeconds = Math.floor((Date.now() - session.currentQuestionStartTime) / 1000);
    questionTimeRemaining = duration - elapsedSeconds;
    
    if (questionTimeRemaining < 0) questionTimeRemaining = 0;

    let qTimerDisplay = document.getElementById("qTimer");
    qTimerDisplay.innerText = questionTimeRemaining;
    
    if (questionTimeRemaining <= 0) {
        handleQuestionTimeout();
        return;
    }
    qTimerDisplay.innerText = questionTimeRemaining;
    
    questionTimerInterval = setInterval(() => {
        questionTimeRemaining--;
        qTimerDisplay.innerText = questionTimeRemaining;
        
        if (questionTimeRemaining <= 0) {
            clearInterval(questionTimerInterval);
            handleQuestionTimeout();
        }
    }, 1000);
}

// handle question timeout here
function handleQuestionTimeout() {
    let currentQ = shuffledQuestions[currentQuestionIndex];

    
    userAnswers[currentQ.id] = "TIMEOUT"; 
    session.answers = userAnswers;
    saveToLocalStorage("activeExamSession", session);
    
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        currentQuestionIndex++;
        session.currentIndex = currentQuestionIndex;
        session.currentQuestionStartTime = Date.now();
        saveToLocalStorage("activeExamSession", session);
        loadQuestion(currentQuestionIndex);
    } else {
        submitExam();
    }
}

// --- Navigation Events ---

// handle next button click
document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        currentQuestionIndex++;
        session.currentIndex = currentQuestionIndex;
        session.currentQuestionStartTime = Date.now();
        saveToLocalStorage("activeExamSession", session);
        loadQuestion(currentQuestionIndex);
    }
});

// handle submit button click
document.getElementById("submitBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to submit the exam?")) {
        submitExam();
    }
});

// --- Submission ---

// submit exam here
function submitExam() {
    clearInterval(globalTimerInterval);
    clearInterval(questionTimerInterval);
    
    let score = 0;
    let totalScore = 0; 
    
    // Calculate score based on ALL questions in the exam, not just the ones shown in this session
    exam.questions.forEach(q => {
        totalScore += q.score;
        if (userAnswers[q.id] === q.correctAnswer) {
            score += q.score;
        }
    });

    // Update Student Data
    let examRecord = {
        id: exam.id,
        examName: exam.examName,
        score: score,
        date: new Date().toLocaleDateString()
    };
    
    currentUser.completedExams.push(examRecord);
    currentUser.requiredExams = currentUser.requiredExams.filter(e => e.id !== exam.id);
    
    // update teacher data here
    let teacherUpdated = false;
    teachers = teachers.map(t => {
        let eIndex = t.createdExams.findIndex(e => e.id === exam.id);
        if (eIndex !== -1) {
            let enrolledIndex = t.createdExams[eIndex].enrolledStudents.findIndex(s => s.id === currentUser.id);
            if (enrolledIndex !== -1) {
                t.createdExams[eIndex].enrolledStudents[enrolledIndex].score = score;
                t.createdExams[eIndex].enrolledStudents[enrolledIndex].answers = userAnswers;
            } else {
                t.createdExams[eIndex].enrolledStudents.push({ id: currentUser.id, score: score, answers: userAnswers });
            }
            teacherUpdated = true;
        }
        return t;
    });

    // Save Data
    saveToLocalStorage("loggedInUser", currentUser);
    
    let allStudents = getFromLocalStorage("students");
    allStudents = allStudents.map(s => s.id === currentUser.id ? currentUser : s);
    saveToLocalStorage("students", allStudents);

    if (teacherUpdated) {
        saveToLocalStorage("teachers", teachers);
    }
    
    // clear session here
    localStorage.removeItem("activeExamSession");

    // show result here
    document.getElementById("resultScore").innerText = `Your Score: ${score} / ${totalScore}`;
    let message = "";
    if (score >= 50) {
        message = "Congratulations! You passed.";
        document.getElementById("resultScore").classList.add("text-success");
    } else {
        message = "Better luck next time.";
        document.getElementById("resultScore").classList.add("text-danger");
    }
    document.getElementById("resultMessage").innerText = message;
    
    let resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    resultModal.show();
}

initExam();
