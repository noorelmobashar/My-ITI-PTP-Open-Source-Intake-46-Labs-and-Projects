#include <iostream>

using namespace std;

class Shape
{
    int dim1;
    int dim2;

public:
    Shape(int _dim1, int _dim2)
    {
        dim1 = _dim1; dim2 = _dim2;
    }
    Shape(int _dim)
    {
        dim1 = _dim; dim2 = _dim;
    }
    int getDim1()
    {
        return dim1;
    }
    int getDim2()
    {
        return dim2;
    }
    void setDim1(int _dim1)
    {
        dim1 = _dim1;
    }
    void setDim2(int _dim2)
    {
        dim2 = _dim2;
    }
    int calcArea()
    {
        return dim1 * dim2;
    }
    void print()
    {
        cout << "\nThis Shape is: ";
    }
};

class Rectangle : public Shape
{
public:
    Rectangle(int _dim1Length, int _dim2Width) : Shape(_dim1Length, _dim2Width)
    {

    }
    void print()
    {
        Shape::print();
        cout << "Rectangle.\n";
    }
};

class Triangle : public Shape
{
public:
    Triangle(int _dim1Base, int _dim2Median) : Shape(_dim1Base, _dim2Median)
    {

    }
    float calcArea()
    {
        return Shape::calcArea() * 0.5;
    }
    void print()
    {
        Shape::print();
        cout << "Triangle.\n";
    }
};

class Circle : private Shape
{
public:
    Circle(int _dimRadius) : Shape(_dimRadius)
    {

    }
    int getDim()
    {
        return getDim1();
    }
    int setDim(int _dim)
    {
        setDim1(_dim); setDim2(_dim);
    }
    float calcArea()
    {
        return Shape::calcArea() * 3.14;
    }
    void print()
    {
        Shape::print();
        cout << "Circle.\n";
    }

};

int main()
{
    Rectangle r1(4, 5);
    Triangle t1(4, 6);
    Circle c1(6);

    r1.print();
    cout << "Rectangle Area is: " << r1.calcArea();
    t1.print();
    cout << "Triangle Area is: " << t1.calcArea();
    c1.print();
    cout << "Circle Area is: " << c1.calcArea();

    return 0;
}
