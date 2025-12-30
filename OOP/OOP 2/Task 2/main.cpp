#include <iostream>

using namespace std;

int main()
{
    int n;
    cout << "Enter Your Degree (0-100): ";cin >> n;

    if(n >= 95)
        cout << "Your Grade is A+!\n";
    else if(n >= 90)
        cout << "Your Grade is A!\n";
    else if(n >= 85)
        cout << "Your Grade is B+!\n";
    else if(n >= 80)
        cout << "Your Grade is B!\n";
    else if(n >= 75)
        cout << "Your Grade is C+!\n";
    else if(n >= 70)
        cout << "Your Grade is C!\n";
    else if(n >= 65)
        cout << "Your Grade is D+!\n";
    else if(n >= 60)
        cout << "Your Grade is D!\n";
    else
        cout << "Your Grade is F!\n";

    return 0;
}
