#include <iostream>
#include <string.h>
using namespace std;

class Person
{
    int id;
    char name[100];
    int age;

public:
    Person(int _id, char* _name, int _age)
    {
        id = _id; strcpy(name, _name); age = _age;
    }
    int getId()
    {
        return id;
    }
    char* getName()
    {
        return name;
    }
    int getAge()
    {
        return age;
    }
    void setId(int _id)
    {
        id = _id;
    }
    void setName(char* _name)
    {
        strcpy(name, _name);
    }
    void setAge(int _age)
    {
        age = _age;
    }
    void print()
    {
        cout << id << "\t" << name << "\t" << age;
    }

};

class emp : public Person
{
    int salary;

public:

    emp(int _id, char* _name, int _age, int _salary = 0) : Person(_id, _name, _age)
    {
        salary = _salary;
    }

    int getSalary()
    {
        return salary;
    }

    void setSalary(int _salary)
    {
        salary = _salary;
    }

    void print()
    {
        Person::print();
        cout << "\t" << salary;
    }
};

class Student : public Person
{
    int grade;

public:

    Student(int _id, char* _name, int _age, int _grade = 0) : Person(_id, _name, _age)
    {
        grade = _grade;
    }

    int getGrade()
    {
        return grade;
    }

    void setGrade(int _grade)
    {
        grade = _grade;
    }

    void print()
    {
        Person::print();
        cout << "\t" << grade;
    }
};

int main()
{
    Person p1(2, "Noor", 14);
    emp e1(3, "ahmed", 23, 2000);
    Student s1(5, "Mona", 45, 80);


    p1.print();
    cout << "\n";
    e1.print();
    cout << "\n";
    s1.print();
    cout << "\n";

    return 0;
}
