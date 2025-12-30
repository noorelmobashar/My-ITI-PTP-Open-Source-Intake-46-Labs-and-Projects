#include <iostream>
#define size 10
using namespace std;

int main()
{
    int arr[size];

    //taking input
    for(int i = 0;i < size; i++)
    {
        cout << "Insert Value for arr[" << i << "]: ";cin >> arr[i];
    }

    //printing data
    cout << "\nArray Data Before Sort: ";
    for(int i = 0;i < size;i++)
    {
        cout << arr[i] << " ";
    }
    cout << "\n";

    //bubble sort
    for(int i = 0;i < size;i++)
    {
        for(int j = i + 1;j < size;j++)
        {
            if(arr[i] > arr[j])
            {
                swap(arr[i],arr[j]);
            }
        }
    }

    //printing data
    cout << "\nArray Data After Sort: ";
    for(int i = 0;i < size;i++)
    {
        cout << arr[i] << " ";
    }
    cout << "\n";

    return 0;
}
