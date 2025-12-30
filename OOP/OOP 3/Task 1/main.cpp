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
    cout << "\nArray Data: ";
    for(int i = 0;i < size;i++)
    {
        cout << arr[i] << " ";
    }
    cout << "\n";

    //getting sum
    int sum = 0;
    for(int i = 0;i < size;i++)sum += arr[i];
    cout << "Sum of the Array is: " << sum << "\n";

    //getting max and min
    int max = 0, min = 0;
    for(int i = 0; i < size;i++)
    {
        if(arr[max] < arr[i])max = i;
        if(arr[min] > arr[i])min = i;
    }

    cout << "The minimum number in the array is " << arr[min] << " at index " << min << "\n";
    cout << "The maximum number in the array is " << arr[max] << " at index " << max << "\n";

    //search for elements in the array
    char ch;
    do {
        cout << "Do you want to search for an element in the array? (y/n): ";cin >> ch;
        if(ch == 'y')
        {
            int value, flag = 0;
            cout << "Insert the value you want to search for: ";cin >> value;

            for(int i = 0;i < size;i++)
            {
                if(arr[i] == value)
                {
                    flag = 1;
                    cout << "Found element " << value << " at index " << i << "!\n";
                }
            }

            if(flag == 0)
            {
                cout << "The value " << value << " does not exist in the array.\n";
            }

        }
    } while(ch == 'y');


    return 0;
}
