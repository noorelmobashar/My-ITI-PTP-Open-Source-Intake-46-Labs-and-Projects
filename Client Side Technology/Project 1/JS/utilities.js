
// get data from local storage here
function getFromLocalStorage(key) {
    let data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// save data to local storage here
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// clear data from local storage here
function clearLocalStorage(key) {
    localStorage.removeItem(key);
}

// check if user is logged in and redirect him
function checkLoggedInUser() {
    let currentUser = getFromLocalStorage("loggedInUser");
    if (currentUser) {
        if(window.location.pathname.endsWith("login.html") || window.location.pathname.endsWith("register.html") || window.location.pathname.endsWith("index.html")) {
            if (currentUser.role === 'student') {
                window.location.href = "studentDashboard.html";
            } else if (currentUser.role === 'teacher') {
                window.location.href = "teacherDashboard.html";
            }
        }
    }
    else 
    {
        window.location.href = "login.html";
    }
}

// upload student image to imgbb here
async function uploadStudentImage(imageFile) {
    let formData = new FormData();
    formData.append("image", imageFile);
    let response = await fetch("https://api.imgbb.com/1/upload?key=<YOUR_KEY>", {
        method: "POST",
        body: formData
    });
    let data = await response.json();
    return data.data.medium.url;
}



if(getFromLocalStorage("teachers").length === 0)
{
    // create 2 teachers if there are no teachers
    let teachers = getFromLocalStorage("teachers");
    let teacher1 = new Teacher({ username: "noorelmobashar", password: "12345678a", mobileNumber: "01551825532", profilePicture: "teacherImgs/noorelmobashar.jpg" });
    let teacher2 = new Teacher({ username: "ahmedelsayed", password: "abcdefgh1", mobileNumber: "01551825533", profilePicture: "teacherImgs/ahmedelsayed.jpg" });
    teachers.push(teacher1, teacher2);
    saveToLocalStorage("teachers", teachers);
}

