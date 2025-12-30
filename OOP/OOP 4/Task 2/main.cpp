#include <iostream>
using namespace std;

int factorial(int n);

int main()
{
    int n;
    cout << "Insert a number to get its factorial: ";cin >> n;
    cout << "Factorial of " << n << " is: " << factorial(n);
    return 0;
}

int factorial(int n)
{
    int res = 1;
    for(int i = 2;i <= n;i++)
    {
        res *= i;
    }
    return res;
}

