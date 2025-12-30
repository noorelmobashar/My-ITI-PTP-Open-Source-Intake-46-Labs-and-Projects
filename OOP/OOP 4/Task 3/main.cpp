#include <iostream>
using namespace std;

int power(int x, int y);

int main()
{
    int x, y;
    cout << "Insert x: "; cin >> x;
    cout << "Insert y: "; cin >> y;
    cout << "The result of " << x << "^" << y << " is: " << power(x, y);
    return 0;
}

int power(int x, int y)
{
    int res = 1;
    for(int i = 0;i < y;i++)
    {
        res *= x;
    }
    return res;
}
