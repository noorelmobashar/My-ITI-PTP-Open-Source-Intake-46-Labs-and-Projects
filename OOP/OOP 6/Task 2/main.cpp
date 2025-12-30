#include <iostream>
#include <string.h>
#include <conio.h>
using namespace std;

class ba
{
    int id;
    char name[100];
    int balance = 0;
public:
    int SetId(int _id)
    {
        if(_id > 0)
        {
            id = _id;
            return 1;
        }
        cout << "Invalid value, ID must be greater than 0.\n";
        return 0;
    }
    int SetName(char* _name)
    {
        strcpy(name, _name);
        return 1;
    }
    int SetBalance(int _balance)
    {
        if(_balance > 0)
        {
            balance = _balance;
            return 1;
        }
        cout << "Invalid value, balance must be greater than 0.\n";
        return 0;
    }
    int Deposit(int _value)
    {
        if(_value < 0)
        {
            cout << "The amount to deposit should be a positive number.\n";
            return 0;
        }
        balance += _value;
        return 1;
    }
    int Withdraw(int _value)
    {
        if(_value < 0)
        {
            cout << "The amount to withdraw should be a positive number.\n";
            return 0;
        }
        else if(balance - _value < 0)
        {
            cout << "Insufficient Balance.\n";
            return 0;
        }

        balance -= _value;
        return 1;

    }
    int GetId() {return id;}
    char* GetName() {return name;}
    int GetBalance() {return balance;}

    void print()
    {
        cout << id << "\t|\t" << name << "\t|\t" << balance << "\n";
    }
};

void print(ba b);

int main()
{
    int n, flag, input;
    char data[2][10] = {"ID", "Name"}, name[100];

    do
    {
        cout << "Insert the number of bank accounts: "; cin >> n;
        if(n < 1) cout << "Size must be greater than 0.\n";
    } while(n < 1);

    ba* bas = new ba[n];


    for(int i = 0;i < n;i++)
    {
        for(int j = 0;j < 2;j++)
        {
            do
            {
                cout << "Insert bank account's " << i+1 << ": " << data[j] << ": "; if(j == 1) cin >> name; else cin >> input;
                if (j==0) flag = bas[i].SetId(input);
                if (j==1) flag = bas[i].SetName(name);
            } while(!flag);
        }
    }

    int op, ind, value;
    do
    {
        system("cls");
        cout << "1 - Deposit\n2 - Withdraw\n3 - Show Bank Account Information\n4 - exit\nChoose the operation you want to do (1 - 4): "; cin >> op;

        if(op != 4)
        {
            do
            {
                cout << "choose the bank account index between (0 - " << n - 1 << "): "; cin >> ind;
                if(ind < 0 && ind > n - 1) cout << "Invalid Index.\n";
            } while(ind < 0 && ind > n - 1);
        }

        switch(op)
        {
        case 1:
            do
            {
                cout << "Insert the amount you want to deposit: "; cin >> value;
                flag = bas[ind].Deposit(value);
            } while(!flag);
            cout << "Success\nPress any key to continue.";
            getch();
            break;
        case 2:
            do
            {
                cout << "Insert the amount you want to withdraw: "; cin >> value;
                flag = bas[ind].Withdraw(value);
            } while(!flag);
            cout << "Success\nPress any key to continue.";
            getch();
            break;
        case 3:
            cout << "ID\t|\tName\t|\tBalance\n";
            bas[ind].print();
            cout << "\nPress any key to continue.";
            getch();
            break;
        case 4:
            cout << "\nExiting...\n";
            break;
        }
    } while(op != 4);


    return 0;
}

void print(ba b)
{
    cout << "\n" << b.GetId() << "\t|\t" << b.GetName() << "\t|\t" << b.GetBalance() << "\n";
}
