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
class Stack
{
    private:
        Node<T>* head;
        Node<T>* tail;
        int numNodes;
    public:
        Stack()
        {
            head = NULL; tail = NULL; numNodes = 0;
        }
        ~Stack()
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

            Node<T>* toBeDeleted = tail;
            T result = toBeDeleted->value;

            if(head == tail)
            {
                head = NULL;
                tail = NULL;
            }
            else
            {
                tail = tail->prev;
                tail->next = NULL;
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
            Node<T>* current = tail;
            int i = counts();
            while(current)
            {
                cout << i << ": " << current->value << "\n";
                current = current->prev;
                i--;
            }
        }
        T top()
        {
            if(isEmpty())
                return NULL;

            return tail->value;
        }
};
int main()
{
    int value;
    Stack<int> LL;
    while(true)
    {
        int op;
        cout << "\n1 - Append\n2 - Pop\n3 - Top\n4 - isEmpty?\n5 - Display\n6 - Delete All\nInsert The Number of Operation You Want to Do: "; cin >> op;
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
                    cout << "Your Stack is Empty!\n";
                    break;
                }
                cout << "You Popped: " << LL.pop() << "\n";
                break;
            case 3:
                if(LL.isEmpty())
                {
                    cout << "Your Stack is Empty!\n";
                    break;
                }
                cout << "Stack top is: " << LL.top() << "\n";
                break;
            case 4:
                if(LL.isEmpty())
                    cout << "Your Stack is Empty!\n";
                else
                    cout << "Your Stack is not Empty!\n";
                break;
            case 5:
                if(LL.isEmpty())
                    cout << "Your Stack is Empty!\n";
                else
                    LL.display();
                break;
            case 6:
                LL.deleteAll();
                cout << "\nAll Nodes deleted successfuly\n";
                break;
        }

    }
    return 0;
}
