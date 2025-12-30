#include <iostream>

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

void emptyStack(Stack s);

int main()
{
    int n; cout << "Insert Stack Size: "; cin >> n;
    Stack s(n);

    for(int i = 0;i < n;i++)
    {
        cout << "inserting: " << i+4 << "\n";
        s.push(i+4);
    }
    cout << "removing last element: " << s.top() << "\n";
    s.pop();
    cout << "Inserting: " << n << "\n";
    s.push(n);
    cout << "Stack top is: " << s.top() << "\n";
    emptyStack(s);

    return 0;
}

void emptyStack(Stack s)
{
    while(!s.isEmpty())
    {
        cout << "Removing: " << s.top() << "\n";
        s.pop();
    }
}
