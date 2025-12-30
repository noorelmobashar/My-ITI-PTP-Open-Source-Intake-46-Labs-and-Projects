#include <iostream>

using namespace std;

int main()
{
    int n;
    cout << "Enter a number: ";cin >> n;
    if(n%2)
        cout << "The number " << n << " is odd\n";
    else
        cout << "The number " << n << " is even\n";
    return 0;
}
