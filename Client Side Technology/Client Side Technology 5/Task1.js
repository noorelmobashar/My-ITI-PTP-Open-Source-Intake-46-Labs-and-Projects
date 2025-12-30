{
    const getStudentGrades = ()=>
    {
        // //Task 1.1
        // let grades = [], sum = 0;;
        // for(let i = 0;i < 3;i++)
        // {
        //     grades.push(parseInt(prompt(`Enter Grade For Student ${i + 1}: `)))
        // }
        // for(let i = 0;i < 3;i++)
        // {
        //     console.log(`Student ${i + 1} grade is: ${grades[i]}`);
        //     sum += grades[i];
        // }

        // //Task 1.2
        // console.log(`Sum of Grades is ${sum}`);

        //Task 1.3
        let grades = [], sum = 0, numberOfStudents;
        do
        {
            numberOfStudents = parseInt(prompt("Enter the number of students you want to insert: "));
            if(numberOfStudents < 2 || numberOfStudents > 10)
            {
                alert("Number of students should be between 2 and 10");
            }
        } while(numberOfStudents < 2 || numberOfStudents > 10);

        for(let i = 0;i < numberOfStudents;i++)
        {
            let grade;
            do
            {
                grade = (prompt(`Enter Grade For Student ${i + 1}: `));
                if(isNaN(grade) || parseInt(grade) < 0 || parseInt(grade) > 100)
                    alert("Please Insert a valid number between 0 and 100.");
                else
                    grades.push(parseInt(grade));
            } while(isNaN(grade) || parseInt(grade) < 0 || parseInt(grade) > 100);
        }
        for(let i = 0;i < numberOfStudents;i++)
        {
            console.log(`Student ${i + 1} grade is: ${grades[i]}`);
            sum += grades[i];
        }

        console.log(`Sum of Grades is ${sum}`); 
        
        

    }
    getStudentGrades();
}

