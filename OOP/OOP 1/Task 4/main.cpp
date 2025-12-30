#include <iostream>

using namespace std;

int main()
{

    char c;
    cout << "Enter Your Character (a-z, A-Z): ";cin >> c;

    if(c >= 65 && c <= 90)
    {
        cout << "This is an uppercase character, the lowercase character is: " << (char)(c + 32);
    }
    else if(c >= 97 && c <= 122)
    {
        cout << "This is a lowercase character, the uppercase character is: " << (char)(c - 32);
    }
    else
    {
        cout << "Invalid Character";
    }

    return 0;
}
