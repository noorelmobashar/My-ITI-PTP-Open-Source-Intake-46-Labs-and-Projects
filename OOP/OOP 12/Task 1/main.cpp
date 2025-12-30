#include <iostream>
using namespace std;

template<class t>
class Stack
{
    t* arr;
    int tos;
    int size;

public:

    Stack(int _size)
    {
        arr = new t[_size];
        tos = -1;
        size = _size;
    }

    StackFl(Stack& s)
    {
        tos = s.tos;
        size = s.size;
        arr = new t[size];
        for(int i = 0;i < size;i++)arr[i] = s.arr[i];
    }
    ~Stack()
    {
        delete[] arr;
    }

    int isEmpty()
    {
        return (tos == -1 ? 1 : 0);
    }

    int isFull()
    {
        return (tos == size - 1 ? 1 : 0);
    }
    void push(t _value)
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
            cout << "No pop num Stack is Empty\n"; return;
        }
        tos--;
    }

    t top()
    {
        if(!this->isEmpty())
        {
            return arr[tos];
        }
        cout << "No top num Stack is Empty\n";
    }
};

template<class t>
void Swap(t& x, t& y)
{
    t tmp = x;
    x = y;
    y = tmp;
}

int main()
{
    Stack<int> s(5);
    s.push(50);
    s.push(30);
    cout << s.top() << "\n";

    int x = 5, y = 6;
    cout << "Before swap: X = " << x << ", Y = " << y << "\n";
    Swap<int>(x, y);
    cout << "After swap: X = " << x << ", Y = " << y << "\n";

    return 0;
}
