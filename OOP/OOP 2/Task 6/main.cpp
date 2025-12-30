#include <iostream>

using namespace std;

int main()
{
    int x, y;

    cout << "Enter x value: ";cin >> x;

    do
    {
        cout << "Enter a positive y value: ";cin >> y;
    }while(y < 0);

    int res = 1;
    for(int i = 0; i < y; i++)
    {
        res *= x;
    }

    cout << "The result of " << x << "^" << y << " is " << res;
    return 0;
}
