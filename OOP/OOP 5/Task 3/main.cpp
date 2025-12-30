#include <iostream>

using namespace std;

int main()
{
    int n;
    cout << "Enter the size of the array: ";cin >> n;
    int* arr = new int[n];
    for(int i = 0;i < n;i++)
    {
        cout << "Insert Value of arr[" << i << "]: "; cin >> arr[i];
    }

    cout << "Value of the array are: ";
    for(int i = 0;i < n;i++)
    {
            cout << arr[i] << " ";
    }

    delete arr;

    return 0;
}
