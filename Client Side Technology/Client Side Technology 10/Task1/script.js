let submitBtn = document.querySelector("button");
let studentNameField = document.querySelector("input[name=studentName]");
let studentGradeField = document.querySelector("input[name=studentGrade]");
let studentNameWarningField = document.querySelector(".warning.studentName");
let studentGradeWarningField = document.querySelector(".warning.studentGrade");
let studentsTable = document.querySelector("table");
let studentRepeatWarning = document.querySelector(".warning.repeat");
let sortSelection = document.querySelector("select[name=sortSelection]");
let filterSelection = document.querySelector("select[name=filterSelection]");
let students = []

const toPascalCase = (string) =>
{
    return string[0].toUpperCase() + string.substr(1, string.length).toLowerCase();
}

const sortTable = () =>
{
    let sortSelected, filterSelected; 
    let sortOptions = document.querySelectorAll("option[name=sort]");
    let filterOptions = document.querySelectorAll("option[name=filter]");
    
    for(let option of sortOptions)
    {
        if(option.selected) sortSelected = option.value;
    }

    for(let option of filterOptions)
    {
        if(option.selected) filterSelected = option.value;
    }

    students.sort((a, b) => {
        if(sortSelected == "name")
        {
            if(a.name > b.name)return 1
            if(a.name < b.name)return -1
            return 0;
        }
        else
        {
            return b.grade - a.grade;
        }
    })

    filteredFromSort = students.filter((obj) => {
        if(filterSelected == "all") return 1;
        if(filterSelected == "success") return obj.grade >= 60;
        if(filterSelected == "fail") return obj.grade < 60;
    })

    studentsTable.innerHTML = "";   
    for(let student of filteredFromSort)
    { 
        let newTr = document.createElement("tr");
        studentsTable.append(newTr);
        for(let property in student)
        {
            let newTd = document.createElement("td");
            newTd.style.backgroundColor = student.getDepartmentColor();
            if(property == "department")
            {
                let newBtn = document.createElement("button");
                newBtn.innerText="🗑️";
                newBtn.style.backgroundColor = student.getDepartmentColor();
                newBtn.style.cursor = "pointer";
                newBtn.style.border = 0;
                newTd.append(newBtn);
                newBtn.onclick = function()
                {
                    this.parentElement.parentElement.remove();
                }
            }
            else
                newTd.innerText = student[property];
            newTr.append(newTd);
        }
    }
}

studentNameField.addEventListener("blur", function(){
    if(studentNameField.value == "")
    {
        studentNameWarningField.style.display = "block";
    }
    else
    {
        studentNameWarningField.style.display = "none";
    }
    if(!(studentGradeWarningField.style.display == "block" || studentNameWarningField.style.display == "block"))
    {
        submitBtn.disabled = false;
    }
    else
    {
        submitBtn.disabled = true;
    }
})

studentNameField.addEventListener("focus", function(){
    if(studentNameField.value == "")
    {
        studentNameWarningField.style.display = "block";
    }
    else
    {
        studentNameWarningField.style.display = "none";
    }
    if(!(studentGradeWarningField.style.display == "block" || studentNameWarningField.style.display == "block"))
    {
        submitBtn.disabled = false;
    }
    else
    {
        submitBtn.disabled = true;
    }
})

studentGradeField.addEventListener("blur", function(){
    grade = parseInt(studentGradeField.value);
    if(isNaN(grade) || grade < 0 || grade > 100)
    {
        studentGradeWarningField.style.display = "block";
    }
    else
    {
        studentGradeWarningField.style.display = "none";
    }
    if(!(studentGradeWarningField.style.display == "block" || studentNameWarningField.style.display == "block"))
    {
        submitBtn.disabled = false;
    }
    else
    {
        submitBtn.disabled = true;
    }
})

studentGradeField.addEventListener("focus", function(){
    grade = parseInt(studentGradeField.value);
    if(isNaN(grade) || grade < 0 || grade > 100)
    {
        studentGradeWarningField.style.display = "block";
    }
    else
    {
        studentGradeWarningField.style.display = "none";
    }
    if(!(studentGradeWarningField.style.display == "block" || studentNameWarningField.style.display == "block"))
    {
        submitBtn.disabled = false;
    }
    else
    {
        submitBtn.disabled = true;
    }
})

submitBtn.onclick = function(){

    if(students.map((obj)=>toPascalCase(obj.name)).includes(toPascalCase(studentNameField.value)))
    {
        studentRepeatWarning.style.display = "block";
        return;
    }
    studentRepeatWarning.style.display = "none";
    let studentDepartmentField = document.querySelector("input[name=department]:checked");
    let student = new Student(toPascalCase(studentNameField.value), parseInt(studentGradeField.value), studentDepartmentField.value);
    students.push(student);
    console.log(students);
    sortTable();
}


sortSelection.addEventListener("change", sortTable);
filterSelection.addEventListener("change", sortTable);
