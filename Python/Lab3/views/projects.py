from models import database

def create_project(user_id: int, data: dict) -> bool:

    if not isinstance(data, dict) or not isinstance(user_id, int):
        raise TypeError("data must be dictionary and user_id must be int")
    
    if sorted(data.keys()) != sorted(['title', 'description', 'total_target', 'start_time', 'end_time']):
        raise AttributeError("Missing data in the data attribute")
    
    db = database.get_database_json()

    if db['projects']:
        id = db['projects'][-1]['id'] + 1
    else:
        id = 1
    
    data['id'] = id
    data['user_id'] = user_id

    db['projects'].append(data)
    database.set_database_json(db)

    return True


def update_project(user_id: int, data: dict) -> bool:

    if sorted(data.keys()) != sorted(['id', 'user_id', 'title', 'description', 'total_target', 'start_time', 'end_time']):
        raise AttributeError("Missing data in the data attribute")

    db = database.get_database_json()

    for i in range(len(db['projects'])):
        if db['projects'][i]['id'] == data['id'] and db['projects'][i]['user_id'] == user_id:
            db['projects'][i] = data
            database.set_database_json(db)
            break
    else:
        raise AttributeError("Project not found while updating for this user")
    
    return True
    
def delete_project(user_id: int, project_id: int) -> bool:

    db = database.get_database_json()

    ind = -1
    for i, data in enumerate(db['projects']):
        if data['id'] == project_id and data['user_id'] == user_id:
            ind = i
            break
    else:
        raise AttributeError("Project not found while deleting it for this user")

    db['projects'].pop(ind)
    database.set_database_json(db)

    return True


def view_projects(user_id = 0) -> list[dict]:

    db = database.get_database_json()
    if user_id == 0: return db['projects']
    return [*filter(lambda x: x['user_id'] == user_id, db['projects'])]

def search_projects(date: str) -> list[dict]:

    db = database.get_database_json()
    return [*filter(lambda p: p['start_time'] <= date <= p['end_time'], db['projects'])]

