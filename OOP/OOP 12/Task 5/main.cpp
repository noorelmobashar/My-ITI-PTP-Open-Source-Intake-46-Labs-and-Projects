#include <iostream>

using namespace std;

class String
{
    char* arr;
    int size;
public:

    String(int _size = 1)
    {
        size = _size;
        arr = new char[size];
    }

    String(char* _string)
    {
        int i = 0;
        while(_string[i] != '\0')i++;
        size = i;
        arr = new char[size];
        for(int j = 0;j < size;j++)
            arr[j] = _string[j];
    }

    ~String()
    {
        delete[] arr;
    }

    void print()
    {
        cout << arr << "\n";
    }

    String operator+(const String& s)
    {
        String res(size + s.size);

        for(int i = 0;i < size;i++)
            res.arr[i] = arr[i];


        for(int i = size;i < res.size;i++)
            res.arr[i] = s.arr[i - size];

        return res;
    }

    String& operator=(const String& s)
    {
        if(this == &s)
            return *this;

        size = s.size;
        delete[] arr;
        arr = new char[size];
        for(int i = 0;i < size;i++)
        {
            arr[i] = s.arr[i];
        }
        return *this;
    }
    bool operator<(String &s)
    {
        for(int i = 0;i < abs(size - s.size); i++)
        {
            if(arr[i] < s.arr[i])
                return 1;
            else if(arr[i] > s.arr[i])
                return 0;
        }
        if(size < s.size)
            return 1;
        else
            return 0;
    }
    bool operator>(String &s)
    {
        return !(*this < s);
    }
    bool operator==(String &s)
    {
        if(size != s.size)
            return 0;
        for(int i = 0;i < size;i++)
        {
            if(arr[i] != s.arr[i])
            {
                return 0;
            }
        }
        return 1;
    }
    void ToUpper()
    {
        for(int i = 0;i < size;i++)
        {
            if(arr[i] >= 'a' && arr[i] <= 'z')
            {
                arr[i] = arr[i] - ('a' - 'A');
            }
        }
    }
    void ToLower()
    {
        for(int i = 0;i < size;i++)
        {
            if(arr[i] >= 'A' && arr[i] <= 'Z')
            {
                arr[i] = arr[i] + ('a' - 'A');
            }
        }
    }
};

int main()
{

    String first_name("noor"), last_name(" elmobashar"), full_name;
    full_name = first_name + last_name;
    full_name.print();
    if(first_name > last_name) cout << "first_name is greater than last_name\n";
    if(first_name < last_name) cout << "first_name is smaller than last_name\n";
    if(first_name == last_name) cout << "first_name equals last_name\n";
    else cout << "first_name not equal last_name\n";

    full_name.ToUpper();
    full_name.print();

    full_name.ToLower();
    full_name.print();
    return 0;
}
