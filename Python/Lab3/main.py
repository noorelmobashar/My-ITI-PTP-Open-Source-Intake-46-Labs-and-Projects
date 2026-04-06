from views import users
from views import auth
from views import projects_cli
import os

current_logged_user = {}

print("Welcome to Our Crowd-Funding Application!\n\n")

while not current_logged_user:

    op = None
    while op not in ["1", "2", "3"]:

        print("1 - Register\n2 - Login\n3 - Exit\n")

        op = input("Insert the Operation you want to do: (1, 2, 3): ")
        os.system('cls' if os.name == 'nt' else 'clear')

        if op == "1":
            auth.register_user()
        elif op == "2":
            current_logged_user = auth.login_user()
        elif op == "3":
            exit()
        else:
            print("Invalid Option...\n\n")

while True:
    os.system('cls' if os.name == 'nt' else 'clear')
    op = None
    while op not in ["1", "2", "3", "4", "5"]:

        print(f"\nWelcome Back, {current_logged_user['f_name']} {current_logged_user['l_name']}!")
        print("\n1 - Create Project\n2 - View Projects\n3 - Edit Project\n4 - Delete Project\n5 - Search Projects\n6 - Exit\n\n")
        op = input("Insert the Operation you want to do: (1, 2, 3, 4, 5, 6): ")
        os.system('cls' if os.name == 'nt' else 'clear')

        if op == "1":
            projects_cli.create_project(current_logged_user['id'])
        elif op == "2":
            projects_cli.view_projects()
        elif op == "3":
            projects_cli.edit_project(current_logged_user['id'])
        elif op == "4":
            projects_cli.delete_project(current_logged_user['id'])
        elif op == "5":
            projects_cli.search_projects()
        elif op == "6":
            exit()
        else:
            print("Invalid Option...\n\n")        