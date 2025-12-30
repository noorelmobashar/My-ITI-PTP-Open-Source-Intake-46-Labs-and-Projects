#include <iostream>

using namespace std;

class Fraction
{
    int num;
    int dem;
public:
    Fraction(int _num = 0, int _dem = 1)
    {
        num = _num; dem = _dem;
        if(_dem == 0)
        {
            cout << "Can't Divide by zero ... defaulting to 1.\n";
            dem = 1;
        }
    }
    int getNum()
    {
        return num;
    }
    int getDem()
    {
        return dem;
    }
    void setNum(int _num)
    {
        num = _num;
    }
    void setDem(int _dem)
    {
        if(_dem == 0)
        {
            cout << "Can't Divide by zero...\n";
            return;
        }
        dem = _dem;
    }
    void print()
    {
        cout << "Fraction: " << num << "/" << dem << "\n";
    }
    float calcFraction()
    {
        return (float)num/(float)dem;
    }
    Fraction operator+(Fraction& c)
    {
        Fraction res;
        res.num = num + c.num;
        res.dem = dem + c.dem;
        return res;
    }
    Fraction operator+(int _i)
    {
        Fraction res;
        res.num = num + _i;
        res.dem = dem + _i;
        return res;
    }
    bool operator==(Fraction& c)
    {
        return (num == c.num && dem == c.dem);
    }
    bool operator!=(Fraction& c)
    {
        return !(*this == c);
    }
    Fraction& operator++()
    {
        num++; dem++;
        return *this;
    }
    Fraction& operator++(int)
    {
        Fraction res(num, dem);
        num++; dem++;
        return res;
    }
    explicit operator int()
    {
        return (int)calcFraction();
    }
    explicit operator float()
    {
        return calcFraction();
    }
    friend Fraction operator+ (int _i, Fraction& c);

};

Fraction operator+ (int _i, Fraction& c)
{
    Fraction res;
    res.num = c.num + _i;
    res.dem = c.dem + _i;
    return res;
}



int main()
{
    Fraction c1, c2(7, 3), c3(2, 5);
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
    float y = float(c1);
    cout << y << "\n";

    return 0;
}
