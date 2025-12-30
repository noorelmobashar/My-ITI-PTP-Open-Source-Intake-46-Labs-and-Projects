#include <iostream>
#include <string.h>

using namespace std;

struct student
{
    int id;
    char name[100];
    int age;
};

void printStudentData(student stud);

int main()
{
    student stud;


    cout << "Insert your ID: "; cin >> stud.id; cin.ignore();
    cout << "Insert your name: "; gets(stud.name);
    cout << "Insert your age: "; cin >> stud.age;

    printStudentData(stud);

    return 0;
}

void printStudentData(student stud)
{
    cout << "\nStudent ID: " << stud.id << '\n';
    cout << "Student name: " << stud.name << '\n';
    cout << "Student age: " << stud.age << '\n';
}
