#include <iostream>
#include <conio.h>
#include <windows.h>

using namespace std;

struct employee
{
    int id;
    char name[100];
    int salary;

};

employee addEmployee();
void gotoxy(int x, int y);
void textattr(int color);
void printEmployeesData(employee emps[], bool isReserved[], int s);

int main() {

    char names[3][100] = { "New", "Display", "Exit" };
    char newMenu[2][100] = {"Add an Employee", "Go Back"};
    char displayMenu[3][100] = {"Show All Employees Data", "Go Back"};
    int index = 0, depth = 0, n;
    char ch;

    gotoxy(68, 20);
    textattr(0x0A);
    cout << "Welcome to the employmees system!\n";
    textattr(0x07);
    do
    {
       gotoxy(60, 21);
       cout << "Insert the number of employees in your company: "; cin >> n;
       if(n < 1)
       {
           gotoxy(60, 22);
           cout << "Invalid number of employees. Number of employees should be greater than 0.\n";
           gotoxy(60, 21);
           cout << "                                                                              ";
       }
    }while (n < 1);

    employee* emps = new employee[n];
    bool* isReserved = new bool[n];
    for(int i = 0;i < n;i++)isReserved[i] = 0;

    do {

        system("cls");

        for (int i = 0; i < 3; i++) {
            if (i == index) textattr(0x0A);

            gotoxy(70, 20 + i);
            switch(depth)
            {
                case 0:
                    cout << names[i];
                    break;
                case 1:
                    cout << newMenu[i];
                    break;
                case 2:
                    cout << displayMenu[i];
                    break;
            }
            textattr(0x07);
            if(depth != 0 && i == 1) break;
        }

        ch = getch();

        switch(ch)
        {
            case -32:

                ch = getch();
                switch (ch) {
                    case 72:
                        index--;
                        if (index < 0) index = 2;
                        break;

                    case 80:
                        index++;
                        if (index > 2) index = 0;
                        break;
                }
                break;

            case 13:

                system("cls");
                switch (index)
                {
                    case 0:
                        switch (depth)
                        {
                            case 0:
                                depth = 1;
                                break;
                            case 1:
                                system("cls");
                                int id;
                                do{
                                    cout << "Choose the Index you want to insert the data In (0-"<<n<<"): "; cin >> id;
                                    if(id > -1 && id < n)
                                    {
                                        if(isReserved[id])
                                        {
                                            char decision;
                                            cout << "It seems like this index is reserved for another employee, do you want to overwrite it? (y/n): ";
                                            cin >> decision;
                                            if(decision == 'y')
                                            {
                                                employee emp = addEmployee();
                                                emps[id] = emp;
                                                cout << "Employee Added Successfully!\n";
                                                cout << "Press Any Key to Go Back";
                                                getch();
                                                break;
                                            }
                                            else
                                            {
                                                cout << "Choose one of the available indices to add an employee in: ";
                                                for(int i = 0;i < n;i++)
                                                {
                                                    if(!isReserved[i])cout << i << " ";
                                                }
                                                cout << ", or choose -1 for Abort: "; cin >> id;

                                                do {
                                                    if(id == -1)
                                                    {
                                                        break;
                                                    }
                                                    if(isReserved[id])
                                                        cout << "Invalid Choice, Insert a Valid Choice: ";
                                                } while(isReserved[id]);

                                                if(id != -1)
                                                {
                                                    employee emp = addEmployee();
                                                    emps[id] = emp;
                                                    isReserved[id] = 1;
                                                    cout << "Employee Added Successfully!\n";
                                                    cout << "Press Any Key to Go Back";
                                                    getch();
                                                    break;
                                                }
                                                else
                                                {
                                                    break;
                                                }
                                            }
                                        }
                                        else
                                        {
                                            employee emp = addEmployee();
                                            emps[id] = emp;
                                            isReserved[id] = 1;
                                            cout << "Employee Added Successfully!\n";
                                            cout << "Press Any Key to Go Back";
                                            getch();
                                            break;
                                        }
                                    }
                                    else
                                    {
                                        cout << "Invalid Range...\n";
                                    }
                                } while(true);
                                break;

                            case 2:
                                printEmployeesData(emps, isReserved, n);
                                cout << "Press Any Key to Go Back";
                                getch();
                                break;

                        }
                        break;

                    case 1:

                        switch(depth)
                        {
                            case 0:
                                index = 0;
                                depth = 2;
                                break;
                            case 1:
                            case 2:
                                index = 0;
                                depth = 0;
                                break;


                        }
                        break;

                    case 2:

                        switch(depth)
                        {
                            case 0:
                                cout << "Terminating...\n";
                                delete emps;
                                delete isReserved;
                                return 0;
                            case 2:
                                index = 0;
                                depth = 0;
                                break;
                        }
                        break;

                }
                break;
        }

    } while (ch != 27);

    return 0;
}

void gotoxy(int x, int y) {
    COORD coord;
    coord.X = x;
    coord.Y = y;
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

void textattr(int color) {
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), color);
}

employee addEmployee()
{
    employee emp;
    cout << "Insert Employee ID: "; cin >> emp.id; cin.ignore();
    cout << "Insert Employee name: "; gets(emp.name);
    cout << "Insert Employee salary: "; cin >> emp.salary;
    return emp;
}

void printEmployeesData(employee emps[], bool isReserved[], int s)
{
    bool flag = 0;
    for(int i = 0; i < s; i++)
    {
        if(isReserved[i])
        {
            flag = 1;
            break;
        }
    }
    if(!flag)
    {
        cout << "\nNo Employees Found\n";
        return;
    }

    cout << "Printing Employees Data...\n";
    cout << "ID\t|\tName\t|\tSalary\n";
    for(int i = 0; i < s; i++)
    {
        if(isReserved[i])
        {
            cout << emps[i].id << "\t|\t" << emps[i].name << "\t|\t" << emps[i].salary << "\n";
            flag = 1;
        }
    }

}
