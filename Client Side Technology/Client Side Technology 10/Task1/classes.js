class Student
{
    constructor(name, grade, department)
    {
        this.name = name;
        this.grade = grade;
        this.department = department;
    }
    getDepartmentColor()
    {
        switch(this.department)
        {
            case "SD":
                return "#FFB5C0";
            case "OS":
                return "#FFFEE0";
            case "EL":
                return "#88CEF9";
        }
    }
};