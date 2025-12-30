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

};
int main()
{
    Fraction f1(3, 2);
    f1.print();
    cout << "Fraction calculation is: " << f1.calcFraction() << "\n";
    return 0;
}
