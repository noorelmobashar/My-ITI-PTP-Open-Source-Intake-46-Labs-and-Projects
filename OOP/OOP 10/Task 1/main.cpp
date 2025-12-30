#include <iostream>

using namespace std;

class Parent
{
protected:
    int x;
    int y;
public:
    Parent(int _x = 1, int _y = 1){x = _x; y = _y;}
    int add()
    {
        return x + y;
    }
};

class Child : public Parent
{
    int z;
public:
    Child(int _x = 1, int _y = 1, int _z = 1) : Parent(_x, _y) {z = _z;}
    int add()
    {
        return x + y + z;
    }
};
int main()
{
    Parent* ptr1;
    Child c1(5, 7, 3);
    Parent p1 = c1;
    ptr1 = &c1;

    cout << "Parent Add Result: " << p1.add() << "\n";
    cout << "Child Add Result: " << c1.add() << "\n";
    cout << "Parent pointer on child with virtual Add Result: " << ptr1->add() << "\n";


    return 0;
}
