// check if user is already logged in
checkLoggedInUser();

// get students and teachers from local storage
let students = getFromLocalStorage("students");
let teachers = getFromLocalStorage("teachers");


// listen to form submit
document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;

    // check if username and password match any student or teacher
    let user = students.find(student => student.username === username && student.password === password) ||
               teachers.find(teacher => teacher.username === username && teacher.password === password);

    if (user) {
        // save logged in user to local storage and redirect him
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        if (user.role === 'student') {
            window.location.href = "studentDashboard.html";
        } else if (user.role === 'teacher') {
            window.location.href = "teacherDashboard.html";
        }
    } else {
        // show error if login fails
        document.querySelector(".invalid-feedback").style.display = "flex";
    }
});

