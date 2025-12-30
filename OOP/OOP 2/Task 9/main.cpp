#include <iostream>

using namespace std;

int main()
{
    int first = 0, second = 1, current, ind;

    cout << "Enter the index of the Fibonacci number you want to show: ";cin >> ind;

    switch(ind)
    {
        case 0:
            current = 0;
            break;

        case 1:
            current = 1;
            break;

        default:

            int tmp;
            for(int i = 2; i <= ind; i++)
            {
                current = first + second;
                tmp = second;
                second = current;
                first = tmp;
            }
            break;
    }

    cout << "The Fibonacci number in index " << ind << " is " << current;

    return 0;
}
