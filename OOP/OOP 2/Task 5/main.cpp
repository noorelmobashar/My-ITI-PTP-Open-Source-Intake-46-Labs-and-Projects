#include <iostream>

using namespace std;

int main()
{
    int n, res = 1;
    cout << "Enter a Number: ";cin >> n;

    for(int i = 2; i <= n; i++)
    {
        res *= i;
    }
    cout << "Factorial of " << n << " is " << res;

    return 0;
}
