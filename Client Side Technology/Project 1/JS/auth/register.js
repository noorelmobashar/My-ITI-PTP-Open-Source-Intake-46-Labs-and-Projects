// check if user is logged in
checkLoggedInUser();
let students = getFromLocalStorage("students") || [];
let teachers = getFromLocalStorage("teachers") || [];
let passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
let validUsername = false;
let validPassword = false;
let validGrade = false;
let validMobile = false;
let validProfilePic = false;
let pictureURL = "";

// validate form here
function validateForm() {
    let registerButton = document.querySelector("form button[type='submit']");
    if (validUsername && validPassword && validGrade && validMobile && validProfilePic) {
        registerButton.removeAttribute("disabled");
    } 
    else {
        registerButton.setAttribute("disabled", "true");
    }
}

// check if username is valid and not taken
document.querySelector("#username").addEventListener("input", function() {
    let username = this.value;
    let usernameExists = students.find(student => student.username === username) || teachers.find(teacher => teacher.username === username);

    if (usernameExists || username.length < 3 || username.includes(" ")) {
        validUsername = false;
        if(username.length < 3){
            document.querySelector("#invalidUsernameFeedback p").innerText = "Username must be at least 3 characters long.";
        } else if(usernameExists){
            document.querySelector("#invalidUsernameFeedback p").innerText = "Username already exists.";
        }
        else {
            document.querySelector("#invalidUsernameFeedback p").innerText = "Username cannot contain spaces.";
        }
        this.classList.add("is-invalid");
        this.classList.remove("is-valid");
    } else {
        this.classList.add("is-valid");
        this.classList.remove("is-invalid");
        validUsername = true;
    } 
    validateForm();
});

// check if password is strong enough
document.querySelector("#password").addEventListener("input", function() {
    let password = this.value;
    if (!passwordPattern.test(password)) {
        this.classList.add("is-invalid");
        this.classList.remove("is-valid");
    } else {
        this.classList.add("is-valid");
        this.classList.remove("is-invalid");
        validPassword = true;
    }
    validateForm();
});

// check if grade is selected
document.querySelector("#grade").addEventListener("input", function() {
    if(this.value === "Select your grade"){
        this.classList.add("is-invalid");
        this.classList.remove("is-valid");
    } else {
        this.classList.add("is-valid");
        this.classList.remove("is-invalid");
        validGrade = true;
    }
    validateForm();
});

// check if mobile number is valid
document.querySelector("#mobile").addEventListener("input", function() {
    let mobilePattern = /^01[0-2,5]{1}[0-9]{8}$/;
    let mobile = this.value;
    if (!mobilePattern.test(mobile)) {
        this.classList.add("is-invalid");
        this.classList.remove("is-valid");
    } else {
        this.classList.add("is-valid");
        this.classList.remove("is-invalid");
        validMobile = true;
    }
    validateForm();
});

// upload profile picture here
document.querySelector("#profilePic").addEventListener("input", async function() {
    // I will use cdn to upload image and get URL using imgbb API in future
    let profilePic = this.value;
    if (profilePic.trim() === "") {
        this.classList.add("is-invalid");
        this.classList.remove("is-valid");
    } else {
        this.classList.add("is-valid");
        this.classList.remove("is-invalid");
    }
    validProfilePic = false;
    validateForm();

    document.querySelector("#validProfilePicFeedback p").innerText = "Uploading image, please wait...";
    pictureURL = await uploadStudentImage(this.files[0]);
    document.querySelector("#validProfilePicFeedback p").innerText = "Image uploaded successfully.";
    
    validProfilePic = true;
    validateForm();
});

// create new student and save him to local storage
document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();
    let newStudent = new Student({
        username: document.querySelector("#username").value,
        password: document.querySelector("#password").value,
        mobileNumber: document.querySelector("#mobile").value,
        profilePicture: pictureURL,
        grade: document.querySelector("#grade").value
    });
    students.push(newStudent);
    saveToLocalStorage("students", students);
    window.location.href = "login.html";
});