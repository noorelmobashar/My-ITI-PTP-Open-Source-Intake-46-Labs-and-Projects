#include <iostream>

using namespace std;

class MagicBox
{
    int size;
    int** arr;

    void calcMB()
    {
        int row, col;
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
        cout << "\n";
    }

    void destroyMB()
    {
        for(int i = 0;i < size;i++)
        {
            delete[] arr[i];
        }
        delete[] arr;
    }

    void createMB()
    {
        arr = new int*[size];
        for(int i = 0;i < size;i++)
        {
            arr[i] = new int[size];
        }
    }

public:

    MagicBox(int _size = 3)
    {
        if(_size%2 == 0 || _size < 3)
        {
            cout << "The Magic Box size must be odd and greater than 3. Defaulting to 3...";
            size = 3;
        }
        size = _size;
        createMB();
        calcMB();
    }

    int getSize()
    {
        return size;
    }

    void setSize(int _size)
    {
        if(size%2 == 0 || size < 3)
        {
            cout << "The Magic Box size must be odd and greater than 3. Defaulting to 3...";
            return;
        }

        destroyMB();
        size = _size;
        createMB();
        calcMB();
    }


    void print()
    {
        for(int i = 0;i < size;i++)
        {
            for(int j = 0;j < size;j++)
            {
                cout << arr[i][j] << '\t';
            }
            cout << "\n";
        }
    }
};
int main()
{
    MagicBox mb(3);
    mb.print();
    mb.setSize(5);
    mb.print();
    return 0;
}
