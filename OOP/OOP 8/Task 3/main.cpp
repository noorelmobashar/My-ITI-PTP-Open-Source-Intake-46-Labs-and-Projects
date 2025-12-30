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
    Point ul;
    Point lr;
public:
    Rectangle(int _x1 = 0, int _y1 = 0, int _x2 = 0, int _y2 = 0): ul(_x1, _y1), lr(_x2, _y2)
    {
        cout << "Constructing Rectangle\n";
    }
    ~Rectangle()
    {
        cout << "Destructing Rectangle\n";
    }
    void setUL(int _x, int _y)
    {
        ul.setPoint(_x, _y);
    }
    void setUL(Point x)
    {
        ul.setPoint(x.getX(), x.getY());
    }
    void setLR(int _x, int _y)
    {
        lr.setPoint(_x, _y);
    }
    void setLR(Point x)
    {
        lr.setPoint(x.getX(), x.getY());
    }
    void print()
    {
        cout << "(" << ul.getX() << ", " << ul.getY() << ")\t\t(" << lr.getX() << ", " << ul.getY() << ")\n";
        cout << "(" << ul.getX() << ", " << lr.getY() << ")\t\t(" << lr.getX() << ", " << lr.getY() << ")\n";
    }

};

class Triangle
{
    Point u;
    Point ll;
    Point lr;

public:
    Triangle(int ux = 0, int uy = 0, int llx = 0, int lly = 0, int lrx = 0, int lry = 0): u(ux, uy), ll(llx, lly), lr(lrx, lry)
    {
        cout << "Constructing Triangle\n";
    }
    ~Triangle()
    {
        cout << "Destructing Triangle\n";
    }
    void setU(int _x, int _y)
    {
        u.setPoint(_x, _y);
    }
    void setU(Point x)
    {
        u.setPoint(x.getX(), x.getY());
    }
    void setLL(int _x, int _y)
    {
        ll.setPoint(_x, _y);
    }
    void setLL(Point x)
    {
        ll.setPoint(x.getX(), x.getY());
    }
    void setLR(int _x, int _y)
    {
        lr.setPoint(_x, _y);
    }
    void setLR(Point x)
    {
        lr.setPoint(x.getX(), x.getY());
    }
    void print()
    {
        cout << "\t(" << u.getX() << ", " << u.getY() << ")\n";
        cout << "(" << ll.getX() << ", " << ll.getY() << ")\t(" << lr.getX() << ", " << lr.getY() << ")\n";
    }
};

class Circle
{
    int radius;
    Point c;
public:
    Circle(int _radius, int c1 = 0, int c2 = 0): c(c1, c2)
    {
        radius = _radius;
        cout << "Constructing Circle\n";
    }
    ~Circle()
    {
        cout << "Destructing Circle\n";
    }
    void setC(int _x, int _y)
    {
        c.setPoint(_x, _y);
    }
    void setC(Point x)
    {
        c.setPoint(x.getX(), x.getY());
    }
    void setRadius(int _r)
    {
        radius = _r;
    }
    void print()
    {
        cout << "Center: " << "(" << c.getX() << ", " << c.getY() << ")\nRadius: " << radius << "\n";
    }
};

int main()
{
    Rectangle r1(5, 20, 10, 10);
    r1.print();


    Triangle t1(15, 20, 10, 10, 20, 10);
    t1.print();

    Circle c1(5, 4, 4);
    c1.print();

    return 0;
}
