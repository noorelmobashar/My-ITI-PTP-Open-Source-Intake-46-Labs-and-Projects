#include <iostream>
#define size 5
using namespace std;

int main()
{
    int arr[size][size], row, col;

    //make the magic box
    for(int i = 1;i <= size*size;i++)
    {
        if(i == 1)
        {
            row = 1; col = size/2 + 1;
        }
        else if((i-1)%size)
        {
            row -= 1; col -= 1;
            if(!row)row = size;
            if(!col)col = size;
        }
        else
        {
            row++;
            if(row-1==size)row=1;
        }
        arr[row-1][col-1] = i;
    }

    //print magic box
    for(int i = 0;i < size;i++)
    {
        for(int j = 0;j < size;j++)
        {
            cout << arr[i][j] << '\t';
        }
        cout << "\n";
    }

    return 0;
}
