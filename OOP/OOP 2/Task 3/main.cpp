#include <iostream>

using namespace std;

int main()
{
    int n, sum = 0;
    for(int i = 0;i < 5;i++)
    {
        cout << "Insert a Number: ";cin >> n;
        sum += n;
    }
    cout << "The sum is " << sum;
    return 0;
}
