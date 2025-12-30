#include <iostream>
#include <string.h>
using namespace std;

class emp
{
    int id;
    char name[100];
    int age;
    int salary;

public:

    emp(){}
    emp(int _id, char* _name)
    {
        id = _id;
        strcpy(name, _name);
    }
    emp(int _id, char* _name, int _age)
    {
        id = _id;
        strcpy(name, _name);
        age = _age;
    }
    emp(int _id, char* _name, int _age, int _salary)
    {
        id = _id;
        strcpy(name, _name);
        age = _age;
        salary = _salary;
    }

    int SetId(int _id)
    {
        if(_id > 0)
        {
            id = _id;
            return 1;
        }
        cout << "Invalid value, ID must be greater than 0.\n";
        return 0;
    }
    int SetName(char* _name)
    {
        strcpy(name, _name);
        return 1;
    }
    int SetAge(int _age)
    {
        if(_age >= 20 && _age <= 65)
        {
            age = _age;
            return 1;
        }
        cout << "Invalid Age Range (20 - 65)\n";
        return 0;
    }
    int SetSalary(int _salary)
    {
        if(_salary > 0)
        {
            salary = _salary;
            return 1;
        }
        cout << "Invalid value, Salary must be greater than 0.\n";
        return 0;
    }
    int GetId() {return id;}
    char* GetName() {return name;}
    int GetAge() {return age;}
    int GetSalary() {return salary;}

    void print()
    {
        cout << id << "\t|\t" << name << "\t|\t" << age << "\t|\t" << salary << "\n";
    }
};

void print(emp e);

int main()
{
    int n, flag, input;
    char data[4][10] = {"ID", "Name", "Age", "Salary"}, name[100];

    do
    {
        cout << "Insert the number of employees: "; cin >> n;
        if(n < 1) cout << "Size must be greater than 0.\n";
    } while(n < 1);

    emp* emps = new emp[n];


    for(int i = 0;i < n;i++)
    {
        for(int j = 0;j < 4;j++)
        {
            do
            {
                cout << "Insert Employee's " << i+1 << ": " << data[j] << ": "; if(j == 1)cin >> name; else cin >> input;
                if (j==0) flag = emps[i].SetId(input);
                if (j==1) flag = emps[i].SetName(name);
                if (j==2) flag = emps[i].SetAge(input);
                if (j==3) flag = emps[i].SetSalary(input);
            } while(!flag);
        }
    }

    cout << "ID\t|\tName\t|\tAge\t|\tSalary\n";
    for(int i = 0;i < n;i++)
    {
        emps[i].print();
    }

    print(emps[0]);
    return 0;
}

void print(emp e)
{
    cout << "\n" << e.GetId() << "\t|\t" << e.GetName() << "\t|\t" << e.GetAge() << "\t|\t" << e.GetSalary() << "\n";
}
