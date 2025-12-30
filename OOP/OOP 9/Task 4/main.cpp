#include <iostream>
#include <conio.h>
#include <windows.h>
using namespace std;

class Stack
{

    int* arr;
    int tos;
    int size;

public:

    Stack(int _size)
    {
        arr = new int[_size];
        tos = -1;
        size = _size;
    }

    Stack(Stack& s)
    {
        tos = s.tos;
        size = s.size;
        arr = new int[size];
        for(int i = 0;i < size;i++)arr[i] = s.arr[i];
    }
    ~Stack()
    {
        delete[] arr;
        cout << "Stack Destructed\n";
    }

    int isEmpty()
    {
        return (tos == -1 ? 1 : 0);
    }

    int isFull()
    {
        return (tos == size - 1 ? 1 : 0);
    }
    void push(int _value)
    {
        if(tos < size - 1)
        {
            tos++;
            arr[tos] = _value;
            return;
        }
        cout << "Stack Overflow\n";

    }

    void pop()
    {
        if(this->isEmpty())
        {
            cout << "Stack is Empty\n"; return;
        }
        tos--;
    }

    int top()
    {
        if(!this->isEmpty())
        {
            return arr[tos];
        }
        cout << "Stack is Empty\n";
    }
};

void gotoxy(int x, int y);
void textattr(int color);

int main()
{
    int n = 6, index = 0, s, value;
    char ch;
    cout << "Insert the size of the Stack: "; cin >> s;
    Stack s1(s);
    char arr[n][10] = {"New", "Display", "Peak", "isFull", "isEmpty", "Exit"};
    do
    {
        system("cls");
        for(int i = 0;i < n;i++)
        {
            if(i == index) textattr(0x0A);
            gotoxy(70, 20 + i);
            cout << arr[i];
            textattr(0x07);
        }

        ch = getch();
        switch(ch)
        {
        case -32:
            ch = getch();
            switch (ch)
            {
                case 72:
                    index--;
                    if (index < 0) index = n - 1;
                    break;

                case 80:
                    index++;
                    if (index > n - 1) index = 0;
                    break;
            }
            break;
        case 13:
            system("cls");
            switch(index)
            {
            case 0:
                if(s1.isFull())
                {
                    cout << "You can't add to the stack, stack if full.\n";
                    break;
                }
                cout << "Insert the value you want to add to the stack: "; cin >> value;
                s1.push(value);
                cout << "Element has been added successfully\n";
                break;
            case 1:
                if(s1.isEmpty())
                {
                    cout << "There are no elements in the stack to pop. \n";
                    break;
                }
                cout << "You have popped " << s1.top() << " From the stack.\n";
                s1.pop();
                break;
            case 2:
                if(s1.isEmpty())
                {
                    cout << "There are no elements in the stack.\n";
                    break;
                }
                cout << "The peak element in the stack is: " << s1.top() << "\n";
                break;
            case 3:
                if(s1.isFull())
                {
                    cout << "Stack is full.\n";
                }
                else
                {
                    cout << "Stack is not full.\n";
                }
                break;
            case 4:
                if(s1.isEmpty())
                {
                    cout << "Stack is Empty.\n";
                }
                else
                {
                    cout << "Stack is not Empty.\n";
                }
                break;
            case 5:
                cout << "Exiting...";
                exit(0);
            }
            cout << "\nPress Any Key to Continue...";
            ch = getch();


        }

    } while(true);
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
