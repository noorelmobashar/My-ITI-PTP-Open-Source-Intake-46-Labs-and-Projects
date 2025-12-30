// check if user is logged in
checkLoggedInUser();

// get current user data
let currentUser = getFromLocalStorage("loggedInUser");
let students = getFromLocalStorage("students");
let teachers = getFromLocalStorage("teachers");
let pictureURL = currentUser.profilePicture;
let validMobile = false;

// fill the form with user data
document.querySelector("#navProfilePic").src = currentUser.profilePicture;
document.querySelector("#username").value = currentUser.username;
document.querySelector("#mobile").value = currentUser.mobileNumber;
document.querySelector("#grade").value = currentUser.grade;
document.querySelector("#profilePicPreview").src = currentUser.profilePicture;


// validate form here
function validateForm() {
    if(validMobile) {
        document.querySelector("form button[type='submit']").removeAttribute("disabled");
    } 
    else {
        document.querySelector("form button[type='submit']").setAttribute("disabled", "true");
    }
}

// hide grade if user is teacher
if(currentUser.role === 'teacher') {
    document.querySelector("#grade").parentElement.style.display = "none";
    document.querySelector("a").href = "teacherDashboard.html";
}

// upload new profile picture here
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
    document.querySelector('form button[type="submit"]').disabled = true;
    document.querySelector("#validProfilePicFeedback p").innerText = "Uploading image, please wait...";
    pictureURL = await uploadStudentImage(this.files[0]);
    document.querySelector("#validProfilePicFeedback p").innerText = "Image uploaded successfully.";
    document.querySelector("#profilePicPreview").src = pictureURL;
    document.querySelector('form button[type="submit"]').disabled = false;
});

// update user data here
document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();

    currentUser.username = document.querySelector("#username").value;
    currentUser.mobileNumber = document.querySelector("#mobile").value;
    currentUser.grade = document.querySelector("#grade").value;
    currentUser.profilePicture = pictureURL;
    
    // Update student in students array
    if(currentUser.role === 'student') {
        let studentIndex = students.findIndex(student => student.username === currentUser.username);
        students[studentIndex] = currentUser;
        saveToLocalStorage("students", students);
    }
    else if(currentUser.role === 'teacher') {
        let teacherIndex = teachers.findIndex(teacher => teacher.username === currentUser.username);
        teachers[teacherIndex] = currentUser;
        saveToLocalStorage("teachers", teachers);
    }
    saveToLocalStorage("loggedInUser", currentUser);
    document.querySelector("#validProfileFeedback").style.display = "flex";
    setTimeout(() => {
        document.querySelector("#validProfileFeedback").style.display = "none";
    }, 3000);
});


document.querySelector("#mobile").addEventListener("input", function() {
    let mobilePattern = /^01[0-2,5]{1}[0-9]{8}$/;
    let mobile = this.value;
    if (!mobilePattern.test(mobile)) {
        this.classList.add("is-invalid");
        this.classList.remove("is-valid");
        validMobile = false;
    } 
    else 
    {
        this.classList.add("is-valid");
        this.classList.remove("is-invalid");
        validMobile = true;
    }
    validateForm();
});