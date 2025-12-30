#include <iostream>

using namespace std;

template<class T>
class Node {
    public:
        T value;
        Node<T>* next;
        Node<T>* prev;
        Node(T _value)
        {
            next=NULL;prev=NULL;value=_value;
        }
};

template<class T>
class Queue
{
    private:
        Node<T>* head;
        Node<T>* tail;
        int numNodes;
    public:
        Queue()
        {
            head = NULL; tail = NULL; numNodes = 0;
        }
        ~Queue()
        {
            deleteAll();
        }
        void push(T value)
        {
            Node<T>* tmpNode = new Node(value);

            if(head == NULL)
            {
                head = tmpNode;
                tail = tmpNode;
            }
            else
            {
                tmpNode->prev = tail;
                tail->next = tmpNode;
                tail = tmpNode;
            }
            numNodes++;
        }
        int counts()
        {
            return numNodes;
        }
        bool isEmpty()
        {
            return numNodes ? false : true;
        }
        T pop()
        {

            if(isEmpty())
                return NULL;

            Node<T>* toBeDeleted = head;
            T result = toBeDeleted->value;

            if(head == tail)
            {
                head = NULL;
                tail = NULL;
            }
            else
            {
                head = head->next;
                head->prev = NULL;
            }
            delete toBeDeleted;
            numNodes-=1;
            return result;
        }
        void deleteAll()
        {
            Node<T>* start = head;
            Node<T>* next;
            while(start)
            {
                next = start->next;
                delete start;
                start = next;
            }
            head = NULL;
            tail = NULL;
            numNodes = 0;
        }
        void display()
        {
            Node<T>* current = head;
            cout << "Queue: ";
            while(current)
            {
                cout << current->value << " ";
                current = current->next;
            }
            cout << "\n";
        }
        T front()
        {
            if(isEmpty())
                return NULL;

            return head->value;
        }
        T back()
        {
            if(isEmpty())
                return NULL;

            return tail->value;
        }
};
int main()
{
    int value;
    Queue<int> LL;
    while(true)
    {
        int op;
        cout << "\n1 - Append\n2 - Pop\n3 - Front\n4 - Back\n5 - isEmpty?\n6 - Display\n7 - Delete All\nInsert The Number of Operation You Want to Do: "; cin >> op;
        switch(op)
        {
            case 1:
                cout << "Insert Value: "; cin >> value;
                LL.push(value);
                cout << "Value Inserted Successfuly\n";
                break;
            case 2:
                if(LL.isEmpty())
                {
                    cout << "Your Queue is Empty!\n";
                    break;
                }
                cout << "You Popped: " << LL.pop() << "\n";
                break;
            case 3:
                if(LL.isEmpty())
                {
                    cout << "Your Queue is Empty!\n";
                    break;
                }
                cout << "Queue front is: " << LL.front() << "\n";
                break;
            case 4:
                if(LL.isEmpty())
                {
                    cout << "Your Queue is Empty!\n";
                    break;
                }
                cout << "Queue back is: " << LL.back() << "\n";
                break;
            case 5:
                if(LL.isEmpty())
                    cout << "Your Queue is Empty!\n";
                else
                    cout << "Your Queue is not Empty!\n";
                break;
            case 6:
                if(LL.isEmpty())
                    cout << "Your Queue is Empty!\n";
                else
                    LL.display();
                break;
            case 7:
                LL.deleteAll();
                cout << "\nAll Nodes deleted successfuly\n";
                break;
        }

    }
    return 0;
}
