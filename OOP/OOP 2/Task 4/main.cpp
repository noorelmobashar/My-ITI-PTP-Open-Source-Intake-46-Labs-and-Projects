#include <iostream>
#include <conio.h>
using namespace std;

int main()
{
    int words = 0, chars = 0, flag = 0;
    char ch;

    do
    {
        ch = getche();
        switch(ch)
        {
            case 13:
            case ' ':
                if(!flag)
                {
                    words++;
                    flag = 1;
                }
                break;
            default:
                chars++;
                flag = 0;
                break;
        }
    }while(ch != 13);

    cout << "Number of words is " << words;
    cout << "\nNumber of characters is " << chars;
    return 0;
}
