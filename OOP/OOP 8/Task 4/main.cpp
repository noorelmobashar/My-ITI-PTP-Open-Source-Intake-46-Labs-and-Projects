#include <iostream>

using namespace std;

class Point
{
    int x;
    int y;
public:
    Point(int _x = 0, int _y = 0)
    {
        cout << "Constructing Point\n";
        x = _x; y = _y;
    }
    ~Point()
    {
        cout << "Destructing Point\n";
    }
    void setPoint(int _x, int _y)
    {
        x = _x; y = _y;
    }
    int getX()
    {
        return x;
    }
    int getY()
    {
        return y;
    }
    void print()
    {
        cout << "(" << x << ", " << y << ")\n";
    }
};

class Rectangle
{
    Point* ul;
    Point* lr;
public:
    Rectangle()
    {
        cout << "Constructing Rectangle\n";
    }
    ~Rectangle()
    {
        cout << "Destructing Rectangle\n";
    }
    void setUL(int _x, int _y)
    {
        Point p(_x, _y);
        ul = &p;
    }
    void setUL(Point& x)
    {
        ul = &x;
    }
    void setLR(Point& x)
    {
        lr = &x;
    }
    void print()
    {
        cout << "(" << ul->getX() << ", " << ul->getY() << ")\t\t(" << lr->getX() << ", " << ul->getY() << ")\n";
        cout << "(" << ul->getX() << ", " << lr->getY() << ")\t\t(" << lr->getX() << ", " << lr->getY() << ")\n";
    }

};

class Triangle
{
    Point* u;
    Point* ll;
    Point* lr;

public:
    Triangle()
    {
        cout << "Constructing Triangle\n";
    }
    ~Triangle()
    {
        cout << "Destructing Triangle\n";
    }

    void setU(Point& x)
    {
        u = &x;
    }
    void setLL(Point& x)
    {
        ll = &x;
    }
    void setLR(Point& x)
    {
        lr = &x;
    }
    void print()
    {
        cout << "\t(" << u->getX() << ", " << u->getY() << ")\n";
        cout << "(" << ll->getX() << ", " << ll->getY() << ")\t(" << lr->getX() << ", " << lr->getY() << ")\n";
    }
};

class Circle
{
    int radius;
    Point* c;
public:
    Circle()
    {
        cout << "Constructing Circle\n";
    }
    ~Circle()
    {
        cout << "Destructing Circle\n";
    }
    void setC(Point& x)
    {
        c = &x;
    }
    void setRadius(int _r)
    {
        radius = _r;
    }
    void print()
    {
        cout << "Center: " << "(" << c->getX() << ", " << c->getY() << ")\nRadius: " << radius << "\n";
    }
};

int main()
{

    Point ul1(10, 20), lr1(20, 10), u(5, 10), ll(0, 0), lr2(20, 10), c(5, 5);

    Rectangle r1;
    r1.setUL(ul1);
    r1.setLR(lr1);
    r1.print();

    Triangle t1;
    t1.setU(u);
    t1.setLL(ll);
    t1.setLR(lr2);
    t1.print();

    Circle c1;
    c1.setC(c);
    c.print();


    return 0;
}
