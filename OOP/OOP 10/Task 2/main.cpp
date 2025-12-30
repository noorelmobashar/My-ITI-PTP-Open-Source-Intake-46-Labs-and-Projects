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
    Shape(){}
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
    virtual float calcArea()
    {
        return dim1 * dim2;
    }
    virtual void print()
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

class Circle : public Shape
{
public:
    Circle(int _dimRadius) : Shape(_dimRadius)
    {

    }
    int getDim()
    {
        return getDim1();
    }
    void setDim(int _dim)
    {
        setDim1(_dim); setDim2(_dim);
    }
    float calcArea()
    {
        return getDim() * 3.14;
    }
    void print()
    {
        Shape::print();
        cout << "Circle.\n";
    }

};

class Square : public Shape
{
public:
    Square(int _dim) : Shape(_dim)
    {

    }
    int getDim()
    {
        return getDim1();
    }
    void setDim(int _dim)
    {
        setDim1(_dim); setDim2(_dim);
    }
    void print()
    {
        Shape::print();
        cout << "Square.\n";
    }
};

int main()
{
    Shape** shapes = new Shape*[6];
    for(int i = 0;i < 6;i++)
    {
        Shape* ptr;
        if(i < 2)shapes[i] = new Rectangle(i+2, i+3);
        else if(i < 4)shapes[i] = new Circle(i+3);
        else shapes[i] = new Square(i+3);

    }
    for(int i = 0; i < 6;i++)
    {
        shapes[i]->print();
        cout << "Shape area is: " << shapes[i]->calcArea();
    }

    return 0;
}
