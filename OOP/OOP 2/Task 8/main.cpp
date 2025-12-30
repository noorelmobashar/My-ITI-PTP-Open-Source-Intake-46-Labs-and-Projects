#include <iostream>
#include <conio.h>
using namespace std;

int main()
{
    char ch;
    do
    {
        system("cls");

        cout << "\nNew (n/N)\nDisplay (d/D)\nExit (e/E)\n";
        ch = getch();

        switch(ch)
        {

            case 'n':
            case 'N':
                cout << "New is selected\n";
                break;

            case 'd':
            case 'D':
                cout << "Display is selected\n";
                break;

            case 'e':
            case 'E':
                cout << "Exit is selected\n";
                break;

            default:
                cout << "Invalid character\n";
                break;

        }

        cout << "\nPress Any Key to Continue\n";
        getch();

    }while(ch != 'e' && ch != 'E');
    return 0;
}
