#include <iostream>
#include <stack>
#include <queue>
using namespace std;

class Node {
    public:
        int id;
        Node* left;
        Node* right;
        Node(int _id)
        {
            id = _id; left = NULL; right = NULL;
        }
};

class BST {
    private:
        Node* root;

        Node* search(Node* node, int _id) {
            if (node == NULL || node->id == _id)
                return node;
            if (_id < node->id)
                return search(node->left, _id);
            return search(node->right, _id);
        }

        void inorder(Node* node) {
            if (node == NULL) return;
            inorder(node->left);
            cout << node->id << " ";
            inorder(node->right);
        }

        void preorder(Node* node) {
            if (node == NULL) return;
            cout << node->id << " ";
            preorder(node->left);
            preorder(node->right);
        }

        void postorder(Node* node) {
            if (node == NULL) return;
            postorder(node->left);
            postorder(node->right);
            cout << node->id << " ";
        }

        Node* findMin(Node* node) {
            if (node == NULL) return NULL;
            if (node->left == NULL) return node;
            return findMin(node->left);
        }

        Node* findMax(Node* node) {
            if (node == NULL) return NULL;
            if (node->right == NULL) return node;
            return findMax(node->right);
        }

        Node* deleteNode(Node* node, int _id) {
            if (node == NULL) return node;
            if (_id < node->id)
                node->left = deleteNode(node->left, _id);
            else if (_id > node->id)
                node->right = deleteNode(node->right, _id);
            else {
                if (node->left == NULL) {
                    Node* temp = node->right;
                    delete node;
                    return temp;
                } else if (node->right == NULL) {
                    Node* temp = node->left;
                    delete node;
                    return temp;
                }
                Node* temp = findMin(node->right);
                node->id = temp->id;
                node->right = deleteNode(node->right, temp->id);
            }
            return node;
        }

        int height(Node* node) {
            if (node == NULL) return -1;
            int l = height(node->left);
            int r = height(node->right);
            return 1 + (l > r ? l : r);
        }

        int depth(Node* node, int _id, int d) {
            if (node == NULL) return -1;
            if (node->id == _id) return d;
            if (_id < node->id) return depth(node->left, _id, d + 1);
            return depth(node->right, _id, d + 1);
        }

    public:
        BST()
        {
            root = NULL;
        }

        Node* search(int _id)
        {
            return search(root, _id);
        }

        void insert(int _id)
        {
            Node* n = new Node(_id);
            if (root == NULL) {
                root = n;
                return;
            }
            Node* temp = root;
            Node* prev = NULL;
            while (temp != NULL) {
                prev = temp;
                if (_id < temp->id) {
                    temp = temp->left;
                }
                else {
                    temp = temp->right;
                }
            }
            if (_id < prev->id) {
                prev->left = n;
            }
            else {
                prev->right = n;
            }
        }

        void inorder()
        {
            inorder(root);
            cout << endl;
        }

        void preorder()
        {
            preorder(root);
            cout << endl;
        }

        void postorder()
        {
            postorder(root);
            cout << endl;
        }

        int findMin()
        {
            if (root == NULL) {
                cout << "Tree is empty" << endl;
                return 0;
            }
            return findMin(root)->id;
        }

        int findMax()
        {
            if (root == NULL) {
                cout << "Tree is empty" << endl;
                return 0;
            }
            return findMax(root)->id;
        }

        void deleteNode(int _id)
        {
            if (search(_id) == NULL) {
                cout << "Node not found" << endl;
                return;
            }
            root = deleteNode(root, _id);
        }

        int height(int _id)
        {
            Node* node = search(_id);
            if (node == NULL) {
                return -1;
            }
            return height(node);
        }

        int depth(int _id)
        {
            return depth(root, _id, 0);
        }
};
int main()
{
    BST bst;

    cout << "Inserting nodes: 5, 3, 7, 2, 4, 6, 8" << endl;
    bst.insert(5);
    bst.insert(3);
    bst.insert(7);
    bst.insert(2);
    bst.insert(4);
    bst.insert(6);
    bst.insert(8);

    cout << "Inorder traversal: ";
    bst.inorder();

    cout << "Preorder traversal: ";
    bst.preorder();

    cout << "Postorder traversal: ";
    bst.postorder();

    cout << "Searching for 4: " << (bst.search(4) ? "Found" : "Not found") << endl;
    cout << "Searching for 9: " << (bst.search(9) ? "Found" : "Not found") << endl;

    cout << "Minimum value: " << bst.findMin() << endl;
    cout << "Maximum value: " << bst.findMax() << endl;

    cout << "Height of node 5: " << bst.height(5) << endl;
    cout << "Height of node 2: " << bst.height(2) << endl;
    cout << "Height of node 9: " << bst.height(9) << endl; // not found

    cout << "Depth of node 5: " << bst.depth(5) << endl;
    cout << "Depth of node 2: " << bst.depth(2) << endl;
    cout << "Depth of node 9: " << bst.depth(9) << endl; // not found

    cout << "Deleting node 3" << endl;
    bst.deleteNode(3);
    cout << "Inorder after deletion: ";
    bst.inorder();

    cout << "Deleting node 7" << endl;
    bst.deleteNode(7);
    cout << "Inorder after deletion: ";
    bst.inorder();

    cout << "Deleting node 5 (root)" << endl;
    bst.deleteNode(5);
    cout << "Inorder after deletion: ";
    bst.inorder();

    return 0;
}
