#include <iostream>
#include <string.h>
using namespace std;

class Complex
{
    int real;
    int img;

public:

    Complex(int _real = 0, int _img = 0)
    {
        real = _real;
        img = _img;
    }

    void SetReal(int _real)
    {
        real = _real;
    }
    void SetImg(int _img)
    {
        img = _img;
    }
    int GetReal()
    {
        return real;
    }
    int GetImg()
    {
        return img;
    }
    void print()
    {
        if(!img)
        {
            cout << real << "\n";
        }
        else
        {
            if(!real)
            {
                if(img == 1)
                {
                    cout << "j\n";
                }
                else
                {
                    cout << img << "j\n";
                }
            }
            else
            {
                if(img < 0)
                {
                    cout << real << "-" << img << "j\n";
                }
                else
                {
                    cout << real << "+" << img << "j\n";
                }
            }
        }
    }
    void Subtract(Complex c)
    {
        real -= c.GetReal();
        img -= c.GetImg();
    }
    void Add(Complex c)
    {
        real += c.GetReal();
        img += c.GetImg();
    }
};

Complex Add(Complex c1, Complex c2);
Complex Subtract(Complex c1, Complex c2);
void print(Complex c);
int main()
{
    Complex c1, c2, c3(0, 1);
    c1.SetReal(3);
    c1.SetImg(4);
    c2.SetReal(1);
    c2.SetImg(2);
    c3.print();
    cout << "c1 before operations: "; c1.print();
    cout << "c2 before operations: "; c2.print();
    Complex res;

    res = Add(c1, c2);
    cout << "Result of adding c1 and c2 in a standalone function: "; print(res);

    res = Subtract(c1, c2);
    cout << "Result of subtracting c1 and c2 in a standalone function: "; print(res);

    c1.Subtract(c2);
    cout << "Result of subtracting c2 from c1 in a member function: "; c1.print();

    c1.Add(c2);
    cout << "Result of adding c2 to c1 in a member function: "; c1.print();
    return 0;
}

Complex Add(Complex c1, Complex c2)
{
    Complex res;
    res.SetReal(c1.GetReal() + c2.GetReal());
    res.SetImg(c1.GetImg() + c2.GetImg());
    return res;
}

Complex Subtract(Complex c1, Complex c2)
{
    Complex res;
    res.SetReal(c1.GetReal() - c2.GetReal());
    res.SetImg(c1.GetImg() - c2.GetImg());
    return res;
}

void print(Complex c)
{
    int real = c.GetReal(), img = c.GetImg();
    if(!img)
    {
        cout << real << "\n";
    }
    else
    {
        if(!real)
        {
            if(img == 1)
            {
                cout << "j\n";
            }
            else
            {
                cout << img << "j\n";
            }
        }
        else
        {
            if(img < 0)
            {
                cout << real << "-" << img << "j\n";
            }
            else
            {
                cout << real << "+" << img << "j\n";
            }
        }
    }
}
