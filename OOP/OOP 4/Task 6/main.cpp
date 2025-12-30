#include <iostream>
#include <string.h>

using namespace std;

struct employee
{
    int id;
    char name[100];
    int salary;

};

void printEmployeesData(employee emps[], int s);

int main()
{
    employee emps[3];

    for(int i = 0;i < 3;i++)
    {
        cout << "Inserting Data For Employee " << i + 1 << "\n";
        cout << "Insert Employee ID: "; cin >> emps[i].id; cin.ignore();
        cout << "Insert Employee name: "; gets(emps[i].name);
        cout << "Insert Employee salary: "; cin >> emps[i].salary;
        cout << "\n";
    }

    printEmployeesData(emps, 3);

    return 0;
}

void printEmployeesData(employee emps[], int s)
{
    cout << "Printing Employees Data...\n";
    cout << "ID\t|\tName\t|\tSalary\n";
    for(int i = 0; i < s; i++)
    {
        cout << emps[i].id << "\t|\t" << emps[i].name << "\t|\t" << emps[i].salary << "\n";
    }
}
