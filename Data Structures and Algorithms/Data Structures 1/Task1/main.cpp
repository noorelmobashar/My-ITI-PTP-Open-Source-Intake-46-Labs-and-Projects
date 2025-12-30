#include <iostream>

using namespace std;

class Employee {
    public:
        int id;
        string name;
        int age;
        int salary;
        Employee(int _id, string _name, int _age, int _salary)
        {
            id=_id;name=_name;age=_age;salary=_salary;
        }
};

class Node {
    public:
        Employee* emp;
        Node* next;
        Node* prev;
        Node(Employee* _emp, Node* _next, Node* _prev)
        {
            emp=_emp;next=_next;prev=_prev;
        }
};

class LinkedList
{
    private:
        Node* head;
        Node* tail;
        int numNodes;
    public:
        LinkedList()
        {
            head = NULL; tail = NULL; numNodes = 0;
        }
        ~LinkedList()
        {
            deleteAll();
        }
        void append(int id, string name, int age, int salary)
        {
            Employee* tmpEmp = new Employee(id, name, age, salary);
            Node* tmpNode = new Node(tmpEmp, NULL, NULL);

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
        Node* searchID(int id)
        {
            Node* start = head;
            while(start)
            {
                if(start->emp->id == id)
                {
                    return start;
                }
                start = start->next;
            }
            return NULL;
        }
        void display()
        {
            cout << "\tID\t|\tName\t|\tAge\t|\tSalary\t\n";
            Node* start = head;
            if(head == NULL)
                cout << "\t NO RECORDS \t\n";
            else
                while(start)
                {
                    cout << "\t" << start->emp->id << "\t|\t" << start->emp->name << "\t|\t" << start->emp->age << "\t|\t" << start->emp->salary << "\t\n";
                    start = start->next;
                }
        }
        int counts()
        {
            return numNodes;
        }
        bool deleteNode(int id)
        {
            Node* empNode = searchID(id);
            if(empNode == NULL)
                return false;

            if(head == tail)
            {
                head = NULL;
                tail = NULL;
            }

            else if(head == empNode)
            {
                head = head->next;
                head->prev = NULL;
            }

            else if(tail == empNode)
            {
                tail = tail->prev;
                tail->next = NULL;
            }

            else
            {
                empNode->prev->next = empNode->next;
                empNode->next->prev = empNode->prev;
            }

            delete empNode;
            numNodes-=1;
            return true;
        }
        bool insertNode(int _idAfter, int id, string name, int age, int salary)
        {
            Node* checkID = searchID(id);
            if(checkID != NULL)
                return false;

            Node* afterEmp = searchID(_idAfter);
            Employee* newEmp = new Employee(id, name, age, salary);
            Node* newNode = new Node(newEmp, NULL, NULL);
            if(head == NULL)
            {
                head = newNode;
                tail = newNode;
            }
            else if(afterEmp == NULL)
            {
                head->prev = newNode;
                head->prev->next = head;
                head = newNode;
            }
            else if(tail == afterEmp)
            {
                append(id, name, age, salary);
            }
            else
            {
                newNode->prev = afterEmp;
                newNode->next = afterEmp->next;
                afterEmp->next = newNode;
                newNode->next->prev = newNode;
            }
            numNodes++;
            return 1;
        }
        void deleteAll()
        {
            Node* start = head;
            Node* next;
            while(start)
            {
                next = start->next;
                delete start;
                start = next;
            }
            head = NULL;
            tail = NULL;
        }
};
int main()
{
    int id, age, salary;
    string name;
    LinkedList LL;
    while(true)
    {
        int op;
        cout << "\n1 - Append\n2 - Display\n3 - number of nodes\n4 - delete\n5 - Insert\n6 - Delete All\nInsert The Number of Operation You Want to Do: "; cin >> op;
        switch(op)
        {
            case 1:
                cout << "Insert Employee ID (Must be Unique): "; cin >> id;
                while(LL.searchID(id) != NULL)
                {
                    cout << "\nID Exists... \nInsert Employee ID (Must be Unique): "; cin >> id;
                }
                cout << "Insert Employee Name: "; cin >> name;
                cout << "Insert Employee Age: "; cin >> age;
                cout << "Insert Employee Salary: "; cin >> salary;
                LL.append(id, name, age, salary);
                cout << "Employee Inserted Successfuly\n";
                break;
            case 2:
                LL.display();
                break;
            case 3:
                cout << "Number of Nodes is " << LL.counts();
                break;
            case 4:
                cout << "Insert Employee ID You Want to Delete: "; cin >> id;
                while(!LL.deleteNode(id))
                {
                    cout << "\nID Doesn't Exist... \nInsert Employee ID You Want to Delete: "; cin >> id;
                }
                cout << "Employee Deleted Successfuly\n";
                break;
            case 5:
                int afterID;
                cout << "Insert Employee ID You Want to Insert After: "; cin >> afterID;
                cout << "Insert New Employee ID (Must be Unique): "; cin >> id;
                while(LL.searchID(id) != NULL)
                {
                    cout << "\nID Exists... \nInsert New Employee ID (Must be Unique): "; cin >> id;
                }
                cout << "Insert New Employee Name: "; cin >> name;
                cout << "Insert New Employee Age: "; cin >> age;
                cout << "Insert New Employee Salary: "; cin >> salary;
                LL.insertNode(afterID, id, name, age, salary);
                cout << "Employee Inserted Successfuly\n";
                break;
            case 6:
                LL.deleteAll();
                cout << "\nAll Nodes deleted successfuly\n";
                break;
        }

    }
    return 0;
}
