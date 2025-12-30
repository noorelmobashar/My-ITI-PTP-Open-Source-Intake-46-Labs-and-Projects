#include <iostream>
using namespace std;

int reverseInt(int n);

int main()
{
    int n;
    cout << "Insert the number you want to reverse: "; cin >> n;
    cout << "The reverse of " << n << " is: " << reverseInt(n);
    return 0;
}

int reverseInt(int n)
{
    int res = 0;
    while(n > 0)
    {
        res = ((res * 10) + (n % 10));
        n /= 10;
    }
    return res;
}
