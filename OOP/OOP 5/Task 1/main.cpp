#include <iostream>

void swap(int* a, int* b);

using namespace std;

int main()
{
    int a = 5, b = 10;
    cout << "Before swap: a = " << a << ", b = " << b << "\n";
    swap(&a, &b);
    cout << "After swap: a = " << a << ", b = " << b << "\n";

    return 0;
}

void swap(int* a, int* b)
{
    int temp = *a;
    *a = *b;
    *b = temp;
}
