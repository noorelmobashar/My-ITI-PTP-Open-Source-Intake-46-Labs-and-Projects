#include <iostream>

using namespace std;

class StackFl
{
    float* arr;
    int tos;
    int size;

public:

    StackFl(int _size)
    {
        arr = new float[_size];
        tos = -1;
        size = _size;
    }

    StackFl(StackFl& s)
    {
        tos = s.tos;
        size = s.size;
        arr = new float[size];
        for(int i = 0;i < size;i++)arr[i] = s.arr[i];
    }
    ~StackFl()
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
    void push(float _value)
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

    float top()
    {
        if(!this->isEmpty())
        {
            return arr[tos];
        }
        cout << "No top num Stack is Empty\n";
    }
};

class StackCh
{
    char* arr;
    int tos;
    int size;

public:

    StackCh(int _size)
    {
        arr = new char[_size];
        tos = -1;
        size = _size;
    }

    StackCh(StackCh& s)
    {
        tos = s.tos;
        size = s.size;
        arr = new char[size];
        for(int i = 0;i < size;i++)arr[i] = s.arr[i];
    }

    ~StackCh()
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
    void push(char _value)
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
            cout << "no pop ch Stack is Empty\n"; return;
        }
        tos--;
    }

    char top()
    {
        if(!this->isEmpty())
        {
            return arr[tos];
        }
        cout << "no top ch Stack is Empty\n";
    }
};

int getInt(char* arr);

int main()
{
    char arr[100][9], input[100], c;
    cout << "Enter Your Equation: "; cin >> input;

    int in_ind = 0, arr_ind = 0, arr_in_ind = 0;
    while(input[in_ind] != '\0')
    {
        c = input[in_ind];
        if(c - '0' >= 0 && c - '0' <= 9)
        {
            arr[arr_ind][arr_in_ind] = c;
            arr_in_ind++;
        }
        else
        {
            if(arr[arr_ind][0] - '0' >= 0 && arr[arr_ind][0] - '0' <= 9)
                arr[arr_ind][arr_in_ind] = '\0';

            arr_in_ind = 0;

            if(!(in_ind == 0 && input[in_ind] == '('))
                arr_ind++;

            arr[arr_ind][0] = c;
            arr[arr_ind][1] = '\0';

            if((input[in_ind + 1] - '0' >= 0 && input[in_ind + 1] - '0' <= 9) || input[in_ind + 1] == '\0')
            {
                arr_ind++;
            }
        }
        in_ind++;
    }
    arr[arr_ind][arr_in_ind] = '\0';
    arr[arr_ind + 1][0] = '\0';


    StackFl f_s1(1000);
    StackCh c_s1(1000);

    float res = 0;
    arr_ind = 0;
    while(arr[arr_ind][0] != '\0')
    {
        char c = arr[arr_ind][0];
        if(c - '0' >= 0 && c - '0' <= 9)
        {
            float num = (float)getInt(arr[arr_ind]);
            f_s1.push(num);
        }
        else
        {
            if(c_s1.isEmpty())
            {
                c_s1.push(c);
            }
            else
            {
                char tp = c_s1.top();
                if(c == '(')
                {
                    c_s1.push(c);
                }
                else if(c == ')')
                {
                    while(c_s1.top() != '(')
                    {
                        float num1 = f_s1.top(); f_s1.pop();
                        float num2 = f_s1.top(); f_s1.pop();
                        switch(c_s1.top())
                        {
                        case '+':
                            res = num1 + num2; break;
                        case '-':
                            res = num2 - num1; break;
                        case '*':
                            res = num2 * num1; break;
                        case '/':
                            res = num2 / num1; break;
                        }
                        f_s1.push(res);
                        c_s1.pop();
                    }
                    c_s1.pop();
                }
                else if(tp == '*' || tp == '/')
                {
                    if(c == '*' || c == '/')
                    {
                        float num1 = f_s1.top(); f_s1.pop();
                        float num2 = f_s1.top(); f_s1.pop();
                        res = (tp == '*' ? (num1 * num2) : (num2 / num1));
                        f_s1.push(res);
                        c_s1.pop();
                        c_s1.push(c);
                    }
                    else
                    {
                        while(!c_s1.isEmpty() && c_s1.top() != '(')
                        {
                            float num1 = f_s1.top(); f_s1.pop();
                            float num2 = f_s1.top(); f_s1.pop();
                            switch(c_s1.top())
                            {
                            case '+':
                                res = num1 + num2; break;
                            case '-':
                                res = num2 - num1; break;
                            case '*':
                                res = num2 * num1; break;
                            case '/':
                                res = num2 / num1; break;
                            }
                            f_s1.push(res);
                            c_s1.pop();
                        }
                        c_s1.push(c);
                    }
                }
                else
                {
                    if(c == '*' || c == '/')
                    {
                        c_s1.push(c);
                    }
                    else
                    {
                        if(tp != '('){
                            float num1 = f_s1.top(); f_s1.pop();
                            float num2 = f_s1.top(); f_s1.pop();
                            res = (tp == '+' ? (num1 + num2) : (num2 - num1));
                            f_s1.push(res);
                            c_s1.pop();
                            c_s1.push(c);
                        }
                        else
                        {
                            c_s1.push(c);
                        }
                    }
                }


            }
        }
        arr_ind++;
    }

    while(!c_s1.isEmpty())
    {
        float num1 = f_s1.top(); f_s1.pop();
        float num2 = f_s1.top(); f_s1.pop();
        switch(c_s1.top())
        {
        case '+':
            res = num1 + num2; break;
        case '-':
            res = num2 - num1; break;
        case '*':
            res = num2 * num1; break;
        case '/':
            res = num2 / num1; break;
        }
        f_s1.push(res);
        c_s1.pop();
    }
    res = f_s1.top();
    cout << "The result is: " << res << "\n";
    return 0;
}

int getInt(char* arr)
{
    int res = 0, i = 0;
    while(arr[i] != '\0')
    {
        res = (res * 10) + (arr[i] - '0'); i++;
    }
    return res;
}
