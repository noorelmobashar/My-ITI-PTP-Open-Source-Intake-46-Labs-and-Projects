#include <iostream>

using namespace std;

class Complex
{
    int real;
    int img;
    static int cnt;
public:

    Complex(Complex& c)
    {
        real = c.real;
        img = c.img;
        cnt++;
    }
    Complex(int _real = 0, int _img = 0)
    {
        real = _real;
        img = _img;
        cnt++;
    }
    ~Complex()
    {
        cnt--;
    }
    static int getCount()
    {
        return cnt;
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
    Complex operator+(Complex& c)
    {
        Complex res;
        res.real = real + c.real;
        res.img = img + c.img;
        return res;
    }
    Complex operator+(int _i)
    {
        Complex res;
        res.real = real + _i;
        res.img = img;
        return res;
    }
    bool operator==(Complex& c)
    {
        return (real == c.real && img == c.img);
    }
    bool operator!=(Complex& c)
    {
        return !(*this == c);
    }
    Complex& operator++()
    {
        real++;
        return *this;
    }
    Complex& operator++(int)
    {
        Complex res(real, img);
        real++;
        return res;
    }
    explicit operator int()
    {
        return real;
    }
    friend Complex operator+ (int _i, Complex& c);

};

Complex operator+ (int _i, Complex& c)
{
    Complex res;
    res.real = c.real + _i;
    res.img = c.img;
    return res;
}

int Complex::cnt = 0;
int main()
{

    Complex c1, c2(7, 3), c3(2, 5);
    c1 = c2 + c3;
    c1.print();

    c1 = c2 + 3;
    c1.print();

    c1 = c2;
    c1.print();

    if(c1 == c2) cout << "c1 and c2 are equal\n";
    if(c1 != c3) cout << "c1 and c3 are not equal\n";

    ++c1;
    c1.print();
    c1++;
    c1.print();

    int x = (int)c1;
    cout << x << "\n";

    return 0;
}
