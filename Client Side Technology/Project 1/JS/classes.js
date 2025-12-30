// my notes
// student registration =>
// (
// username, password, grade (from 1 to 3), Mobile number, profile pic
// )
// student/teacher login
// redirect student to profile page
// redirect teacher to dashboard to add new quizzes
// otherwise, error message display

// profile page => (
// profile pic, username, list of completed exams => (
// 	exam_name, score, Date_Taken 
// ), list all required (next) exams.
// )

// teacher dashboard => (
// 	create_new_exams => (
// 		exam_name,
// 		exam_duration,
// 		number_of_questions >= 15,
// 		each_quesiton => (
// 			text,
// 			image,
// 			choices,
// 			correct_answer,
// 			diffculty_level (easy, middle, hard),
// 			score
// 		) -- validate sum of scores = 100,
// 		timer
// 	)
// )

// Teacher can update, delete any question in any exam (students who took it?)

// Teacher add all students who should take this exam
// Display all students exam results with dates
// teacher review student exam questions answers
// randomized quiz generation (random order in quesitons and answers)

// each question has a time related to total exam time
// (consider the weight of the quesiton)

// when student finish exam the result will appear.

// After submitting the quiz:
// student see final score
// student can not take exam twice.
// score is saved to student profile

//USE LOCAL STORAGE TO SAVE DATA




// making a user class here so everyone can use it
class User {
    constructor(username, password, mobileNumber, profilePicture) {
        this.username = username;
        this.password = password;
        this.mobileNumber = mobileNumber;
        this.profilePicture = profilePicture;
    }
}

// making a student class here
class Student extends User {

    constructor({ username, password, mobileNumber, profilePicture, grade, id = null, completedExams = [], requiredExams = [] }) {
        super(username, password, mobileNumber, profilePicture);
        // check if student has id or make new one
        if (id) {
            this.id = id;
        } else {
            this.id = Student.getIdfromLocalStorage() + 1;
            Student.saveIdtoLocalStorage(this.id);
        }
        this.grade = grade;
        this.role = 'student';
        this.completedExams = completedExams;
        this.requiredExams = requiredExams;
    }

    // get the id from local storage
    static getIdfromLocalStorage() {
        let storedId = localStorage.getItem('studentIdCounter');
        return storedId ? parseInt(storedId) : 0;
    }

    // save the id to local storage so i don't lose it
    static saveIdtoLocalStorage(currentId) {
        localStorage.setItem('studentIdCounter', currentId.toString());
    }

    // assign exam to student if he didn't take it
    assignExam(examId, examName) {
        if (!this.requiredExams.find(e => e.id === examId) && !this.completedExams.find(e => e.id === examId)) {
            this.requiredExams.push({ id: examId, examName: examName });
        }
    }

    // remove the exam from the student list
    removeExam(examId) {
        this.requiredExams = this.requiredExams.filter(e => e.id !== examId);
        this.completedExams = this.completedExams.filter(e => e.id !== examId);
    }
}


class Teacher extends User {

    constructor({ username, password, mobileNumber, profilePicture, id = null, createdExams = null }) {
        super(username, password, mobileNumber, profilePicture);
        
        if (id) {
            this.id = id;
        } else {
            this.id = Teacher.getFromlocalStorage('teacherIdCounter') + 1;
            Teacher.saveToLocalStorage('teacherIdCounter', this.id);
        }
        
        this.role = 'teacher';

        if (createdExams) {
            this.createdExams = createdExams;
        } else {
            let startId = Teacher.getFromlocalStorage('examIdCounter');
            this.createdExams = [
                {
                    id: startId + 1,
                    examName: "Animals Exam",
                    examDuration: 30,
                    questions: [
                        { id: 1, text: "What is the fastest land animal?", image: null, choices: ["Cheetah", "Lion", "Horse", "Eagle"], correctAnswer: "Cheetah", difficultyLevel: "easy", score: 5 },
                        { id: 2, text: "What is the largest mammal?", image: null, choices: ["Elephant", "Blue Whale", "Giraffe", "Hippo"], correctAnswer: "Blue Whale", difficultyLevel: "easy", score: 5 },
                        { id: 3, text: "Which bird cannot fly?", image: null, choices: ["Eagle", "Sparrow", "Ostrich", "Pigeon"], correctAnswer: "Ostrich", difficultyLevel: "easy", score: 5 },
                        { id: 4, text: "What is the only mammal that can fly?", image: null, choices: ["Bat", "Flying Squirrel", "Bird", "Butterfly"], correctAnswer: "Bat", difficultyLevel: "middle", score: 5 },
                        { id: 5, text: "How many legs does a spider have?", image: null, choices: ["6", "8", "10", "12"], correctAnswer: "8", difficultyLevel: "easy", score: 5 },
                        { id: 6, text: "What is a group of lions called?", image: null, choices: ["Pack", "Herd", "Pride", "School"], correctAnswer: "Pride", difficultyLevel: "middle", score: 5 },
                        { id: 7, text: "Which animal is known as the 'Ship of the Desert'?", image: null, choices: ["Horse", "Camel", "Donkey", "Elephant"], correctAnswer: "Camel", difficultyLevel: "easy", score: 5 },
                        { id: 8, text: "What is the tallest animal in the world?", image: null, choices: ["Elephant", "Giraffe", "Tree", "Dinosaur"], correctAnswer: "Giraffe", difficultyLevel: "easy", score: 5 },
                        { id: 9, text: "Which animal sleeps standing up?", image: null, choices: ["Dog", "Cat", "Horse", "Human"], correctAnswer: "Horse", difficultyLevel: "middle", score: 5 },
                        { id: 10, text: "What is the largest primate?", image: null, choices: ["Monkey", "Gorilla", "Chimpanzee", "Orangutan"], correctAnswer: "Gorilla", difficultyLevel: "middle", score: 5 },
                        { id: 11, text: "Which of these has the longest lifespan?", image: null, choices: ["Dog", "Cat", "Giant Tortoise", "Mouse"], correctAnswer: "Giant Tortoise", difficultyLevel: "hard", score: 5 },
                        { id: 12, text: "What do pandas eat?", image: null, choices: ["Meat", "Fish", "Bamboo", "Insects"], correctAnswer: "Bamboo", difficultyLevel: "easy", score: 5 },
                        { id: 13, text: "Which animal is the symbol of the WWF?", image: null, choices: ["Lion", "Tiger", "Panda", "Bear"], correctAnswer: "Panda", difficultyLevel: "easy", score: 5 },
                        { id: 14, text: "How many hearts does an octopus have?", image: null, choices: ["1", "2", "3", "4"], correctAnswer: "3", difficultyLevel: "hard", score: 5 },
                        { id: 15, text: "What is the largest bird in the world?", image: null, choices: ["Eagle", "Ostrich", "Penguin", "Albatross"], correctAnswer: "Ostrich", difficultyLevel: "middle", score: 5 },
                        { id: 16, text: "Which animal has black and white stripes?", image: null, choices: ["Tiger", "Zebra", "Panda", "Skunk"], correctAnswer: "Zebra", difficultyLevel: "easy", score: 5 },
                        { id: 17, text: "What is a baby kangaroo called?", image: null, choices: ["Cub", "Pup", "Joey", "Calf"], correctAnswer: "Joey", difficultyLevel: "middle", score: 5 },
                        { id: 18, text: "Which animal is known to be man's best friend?", image: null, choices: ["Cat", "Dog", "Horse", "Bird"], correctAnswer: "Dog", difficultyLevel: "easy", score: 5 },
                        { id: 19, text: "What is the slow moving animal with a shell?", image: null, choices: ["Snail", "Slug", "Worm", "Snake"], correctAnswer: "Snail", difficultyLevel: "easy", score: 5 },
                        { id: 20, text: "Which animal produces wool?", image: null, choices: ["Cow", "Goat", "Sheep", "Pig"], correctAnswer: "Sheep", difficultyLevel: "easy", score: 5 }
                    ],
                    timer: 30,
                    enrolledStudents: [],
                }
            ];
            Teacher.saveToLocalStorage('examIdCounter', this.createdExams[0].id);
        }
    }

    static getFromlocalStorage(key) {
        let storedId = localStorage.getItem(key);
        return storedId ? parseInt(storedId) : 0;
    }

    static saveToLocalStorage(key, currentId) {
        localStorage.setItem(key, currentId.toString());
    }

    // create a new exam here and check if questions are enough
    createNewExam(examName, examDuration, questions, timer) {
        const totalScore = questions.reduce((sum, question) => sum + question.score, 0);
        if (questions.length < 15) {
            throw new Error("Number of questions must be at least 15.");
        }
        if (totalScore !== 100) {
            throw new Error("Total score of all questions must equal 100.");
        }
        questions = questions.map((question, index) => ({
            id: index + 1,
            ...question
        }));

        let currentExamId = Teacher.getFromlocalStorage('examIdCounter') + 1;
        Teacher.saveToLocalStorage('examIdCounter', currentExamId);

        const newExam = {
            id: currentExamId,
            examName,
            examDuration,
            questions,
            timer,
            enrolledStudents: [],
        };
        this.createdExams.push(newExam);
        return newExam;
    }

    // add student to exam here
    addStudentToExam(examId, studentId) {
        let exam = this.createdExams.find(e => e.id === examId);
        if (exam && !exam.enrolledStudents.find(s => s.id === studentId)) {
            exam.enrolledStudents.push({ id: studentId, score: null });
        }
    }

    // remove student from exam here
    removeStudentFromExam(examId, studentId) {
        let exam = this.createdExams.find(e => e.id === examId);
        if (exam) {
            exam.enrolledStudents = exam.enrolledStudents.filter(s => s.id !== studentId);
        }
    }

    // delete exam here
    deleteExam(examId) {
        this.createdExams = this.createdExams.filter(e => e.id !== examId);
    }

}