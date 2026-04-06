from datetime import datetime
from views import projects
from views import users
from tabulate import tabulate
import os

def prepare_table_data(projects_data):
    for i, proj in enumerate(projects_data, 1):
        proj['Table ID'] = i

    table_data = []
    for data in projects_data:
        table_data.append({
            'Table ID': data['Table ID'],
            'Title': data['title'],
            'Description': data['description'],
            'Total Target': data['total_target'],
            'Start Date': data['start_time'],
            'End Date': data['end_time']
        })
    return table_data

def create_project(user_id):

    while True:

        title = input("Insert Your Project Title: ")
        if not (title == ""): break
        print("Please insert a valid title")

    while True:

        description = input("Insert Your Project Description: ")
        if not (description == ""): break
        print("Please insert a valid description")

    while True:

        total_target = input("Insert Your Project Total Target: ")
        try:
            total_target = int(total_target)
            if total_target <= 0 or total_target > 1000000:
                raise ValueError("Total Target must be between 1 and 1000000")
            break
        except:
            print("Please insert a valid total target")
    
    while True:

        start_time = input("Enter Project Start Date (YYYY-MM-DD): ")
        try:
            datetime.strptime(start_time, "%Y-%m-%d")
            break
        except ValueError:
            print("Invalid format... Please use YYYY-MM-DD (e.g., 2026-05-20).")

    while True:
        end_time = input("Enter Project End Date (YYYY-MM-DD): ")
        try:
            datetime.strptime(end_time, "%Y-%m-%d")
            if end_time >= start_time:
                break
        except ValueError:
            print("Invalid format... Please use YYYY-MM-DD (e.g., 2026-05-20) OR End Date Must be Greater than or Equal to Start Date.")
        
    data = {
        "title": title,
        "description": description,
        "total_target": total_target,
        "start_time": start_time,
        "end_time": end_time
    }

    projects.create_project(user_id, data)
    os.system('cls' if os.name == 'nt' else 'clear')
    print("Project Created")

def view_projects(user_id = 0):

    projects_data = projects.view_projects(user_id)
    users_data = users.get_users()
    users_data = {i['id']: f"{i['f_name']} {i['l_name']}" for i in users_data}


    for i, data in enumerate(projects_data):
        projects_data[i]["owner"] = users_data[data['user_id']]
        projects_data[i].pop('user_id')
        projects_data[i].pop('id')
    
    print(tabulate(projects_data, headers="keys", tablefmt="fancy_grid"))

    input("\nPress Enter to Continue...")
    os.system('cls' if os.name == 'nt' else 'clear')

def edit_project(user_id):
    projects_data = projects.view_projects(user_id)

    if not projects_data:
        print("No projects to edit.")
        input("Press Enter to continue...")
        os.system('cls' if os.name == 'nt' else 'clear')
        return

    table_data = prepare_table_data(projects_data)
    print(tabulate(table_data, headers="keys", tablefmt="fancy_grid"))

    while True:
        try:
            choice = int(input("Enter the Table ID to edit: "))
            if 1 <= choice <= len(projects_data):
                break
            else:
                print("Invalid Table ID.")
        except ValueError:
            print("Please enter a valid number.")

    selected_project = projects_data[choice - 1]

    print("\nEditing project. Press Enter to keep current value.\n")

    title = input(f"Title ({selected_project['title']}): ") or selected_project['title']
    description = input(f"Description ({selected_project['description']}): ") or selected_project['description']

    while True:
        total_target_str = input(f"Total Target ({selected_project['total_target']}): ") or str(selected_project['total_target'])
        try:
            total_target = int(total_target_str)
            if total_target <= 0 or total_target > 1000000:
                raise ValueError("Total Target must be between 1 and 1000000")
            break
        except ValueError:
            print("Please enter a valid total target (1-1000000).")

    while True:
        start_time = input(f"Start Date ({selected_project['start_time']}): ") or selected_project['start_time']
        try:
            datetime.strptime(start_time, "%Y-%m-%d")
            break
        except ValueError:
            print("Invalid format... Please use YYYY-MM-DD (e.g., 2026-05-20).")

    while True:
        end_time = input(f"End Date ({selected_project['end_time']}): ") or selected_project['end_time']
        try:
            datetime.strptime(end_time, "%Y-%m-%d")
            if end_time >= start_time:
                break
        except ValueError:
            print("Invalid format... Please use YYYY-MM-DD (e.g., 2026-05-20) OR End Date Must be Greater than or Equal to Start Date.")

    data = {
        'id': selected_project['id'],
        'user_id': user_id,
        'title': title,
        'description': description,
        'total_target': total_target,
        'start_time': start_time,
        'end_time': end_time
    }

    projects.update_project(user_id, data)
    os.system('cls' if os.name == 'nt' else 'clear')
    print("Project edited successfully.")

def delete_project(user_id):
    projects_data = projects.view_projects(user_id)

    if not projects_data:
        print("No projects to delete.")
        input("Press Enter to continue...")
        os.system('cls' if os.name == 'nt' else 'clear')
        return

    table_data = prepare_table_data(projects_data)
    print(tabulate(table_data, headers="keys", tablefmt="fancy_grid"))

    while True:
        try:
            choice = int(input("Enter the Table ID to delete: "))
            if 1 <= choice <= len(projects_data):
                break
            else:
                print("Invalid Table ID.")
        except ValueError:
            print("Please enter a valid number.")

    selected_project = projects_data[choice - 1]

    confirm = input(f"Are you sure you want to delete '{selected_project['title']}'? (y/n): ").lower()
    if confirm == 'y':
        projects.delete_project(user_id, selected_project['id'])
        os.system('cls' if os.name == 'nt' else 'clear')
        print("Project deleted successfully.")
    else:
        os.system('cls' if os.name == 'nt' else 'clear')
        print("Deletion cancelled.")

def search_projects():
    while True:
        date = input("Enter the date to search projects (YYYY-MM-DD): ")
        try:
            datetime.strptime(date, "%Y-%m-%d")
            break
        except ValueError:
            print("Invalid format... Please use YYYY-MM-DD (e.g., 2026-05-20).")

    projects_data = projects.search_projects(date)

    users_data = users.get_users()
    users_data = {i['id']: f"{i['f_name']} {i['l_name']}" for i in users_data}

    for i, data in enumerate(projects_data):
        projects_data[i]["owner"] = users_data[data['user_id']]
        projects_data[i].pop('user_id')
        projects_data[i].pop('id')
    
    print(tabulate(projects_data, headers="keys", tablefmt="fancy_grid"))

    input("\nPress Enter to Continue...")
    os.system('cls' if os.name == 'nt' else 'clear')
