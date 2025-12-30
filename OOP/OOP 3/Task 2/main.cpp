#include <iostream>
#define size 3
using namespace std;

int main()
{
    int arr[size][size], sum[size] = {0};
    float avg[size] = {0};

    //get user input
    for(int i = 0;i < size;i++)
    {
        for(int j = 0;j < size;j++)
        {
            cout << "Insert Value for arr[" << i << "][" << j << "]: ";cin >> arr[i][j];
        }
    }

    //printing matrix
    cout << "Matrix: \n";
    for(int i = 0;i < size;i++)
    {
        for(int j = 0;j < size;j++)
        {
            cout << arr[i][j] << '\t';
        }
        cout << "\n";
    }

    //getting sum for each row and average for each column
    for(int i = 0;i < size;i++)
    {
        for(int j = 0;j < size;j++)
        {
            avg[j] += arr[i][j];
            sum[i] += arr[i][j];
        }
    }
    for(int i = 0;i < size;i++)avg[i]/=size;

    cout << "Sum for each row: ";
    for(int i = 0;i < size;i++)cout << sum[i] << " ";

    cout << "\nAverage of each column: ";
    for(int i = 0;i < size;i++)cout << avg[i] << " ";



    return 0;
}
