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
        cout << "Destructed\n";
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
            cout << "No pop num Stack is Empty\n"; return;
        }
        tos--;
    }

    int top()
    {
        if(!this->isEmpty())
        {
            return arr[tos];
        }
        cout << "No top num Stack is Empty\n";
    }
    bool operator==(Stack& s)
    {
        if(tos != s.tos)
            return 0;

        for(int i = 0;i <= tos;i++)
        {
            if(arr[i] != s.arr[i])
                return 0;
        }

        return 1;
    }

    Stack& operator=(const Stack& s)
    {
        if(this == &s)
        {
            return *this;
        }
        delete[] arr;
        arr = new int[s.size];
        size = s.size;
        tos = s.tos;
        for(int i = 0;i <= tos; i++)
            arr[i] = s.arr[i];
        return *this;
    }
    Stack operator+(const Stack& s)
    {
        Stack res(size + s.size);
        res.tos = tos + s.tos + 1;

        for(int i = 0;i <= tos;i++)
            res.arr[i] = arr[i];


        for(int i = tos + 1;i <= res.tos;i++)
            res.arr[i] = s.arr[i - (tos + 1)];

        return res;
    }
};

int main()
{

    Stack s1(5), s2(10);
    Stack s3(5), s4(10);
    s1.push(30);
    s1.push(50);
    s2.push(20);
    s2.push(40);
    s2.push(60);
    s3.push(20);
    s4.push(20);

    if(s1 == s2) cout << "s1 and s2 are not equal\n";
    else cout << "s1 and s2 are not equal\n";
    if(s3 == s4) cout << "s3 and s4 are equal\n";
    else cout << "s3 and s4 are not equal\n";

    s3 = s2;
    cout << s3.top() << "\n";

    s4 = s1 + s2;
    cout << "printing..\n";

    while(!s4.isEmpty())
    {
        cout << s4.top() << "\n"; s4.pop();
    }

    return 0;
}
