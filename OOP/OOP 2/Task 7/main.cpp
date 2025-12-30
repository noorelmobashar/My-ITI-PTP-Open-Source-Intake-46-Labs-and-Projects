#include <iostream>

using namespace std;

int main()
{
    int n, res = 0, n_copy;
    cout << "Insert a Number to reverse: ";cin >> n;
    n_copy = n;

    while(n > 0)
    {
        res = ((res*10) + (n%10));
        n /= 10;
    }

    cout << "The reverse of " << n_copy << " is " << res;
    return 0;
}
