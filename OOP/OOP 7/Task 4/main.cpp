#include <iostream>

using namespace std;

class Queue
{
    int *arr;
    int size;
    int fp;
    int lp;
public:
    Queue(int _size)
    {
        arr = new int[_size];
        fp = -1;
        lp = -1;
        size = _size;
    }
    void enqueue(int _value)
    {
        if(fp == -1 && lp == -1)
        {
            fp++; lp++;
            arr[lp] = _value;
        }
        else
        {
            if(!this->isFull())
            {
                lp = (lp + 1) % size;
                arr[lp] = _value;
            }
            else
            {
                cout << "Queue is Full\n";
            }
        }
    }

    void dequeue()
    {
        if(this->isEmpty())
        {
            cout << "Queue is Empty\n";
        }
        else
        {
            if(fp == lp)
            {
                fp = -1;
                lp = -1;
            }
            else
            {
                fp = (fp + 1) % size;
            }
        }
    }
    int isEmpty()
    {
        if(fp == lp && fp == -1)
        {
            return 1;
        }
        return 0;
    }

    int isFull()
    {
        if(fp == (lp + 1) % size)
        {
            return 1;
        }
        return 0;
    }

    int front()
    {
        if(!this->isEmpty())
        {
            return arr[fp];
        }
    }

    int back()
    {
        if(!this->isEmpty())
        {
            return arr[lp];
        }
    }
};

void emptyQueue(Queue& q);


int main()
{
    int n; cout << "Insert the queue size: "; cin >> n;
    Queue q(n);
    for(int i = 0;i < n+5;i++)
    {
        cout << "Inserting: " << i << "\n";
        if(!q.isFull())
        {
            q.enqueue(i);
        }
        else
        {
            cout << "Queue Full, Removing the front: " << q.front() << "\n";
            q.dequeue();
            cout << "Now Inserting: " << i << "\n";
            q.enqueue(i);
        }
    }
    emptyQueue(q);

    return 0;
}

void emptyQueue(Queue& q)
{
    while(!q.isEmpty())
    {
        cout << "Removing: " << q.front() << "\n";
        q.dequeue();
    }
}
