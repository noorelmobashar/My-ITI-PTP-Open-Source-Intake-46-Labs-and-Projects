from models import database

def create_user(data: dict) -> bool:

    if not isinstance(data, dict):
        raise TypeError("data must be dictionary")
    
    if sorted(data.keys()) != sorted(['f_name', 'l_name', 'email', 'password', 'mobile_phone']):
        raise AttributeError("Missing data in the data attribute")
    
    db = database.get_database_json()

    if db['users']:
        id = db['users'][-1]['id'] + 1
    else:
        id = 1

    data['id'] = id
    data['is_email_verified'] = False

    db['users'].append(data)
    database.set_database_json(db)

    return True

def get_user(email: str) -> dict:

    if not isinstance(email, str):
        raise TypeError("email must be string")
    
    db = database.get_database_json()

    try:
        user = [*filter(lambda x: x['email'] == email, db['users'])][0]
        return user
    except IndexError:
        return {}

def update_user(data: dict) -> bool:

    if not isinstance(data, dict):
        raise TypeError("data must be dictionary")

    if sorted(data.keys()) != sorted(['f_name', 'l_name', 'email', 'password', 'mobile_phone', 'id', 'is_email_verified']):
        raise AttributeError("Missing data in the data attribute")

    db = database.get_database_json()

    for i in range(len(db['users'])):
        if db['users'][i]['id'] == data['id']:
            db['users'][i] = data
            database.set_database_json(db)
            break
    else:
        raise AttributeError("User not found while updating")

    return True

def get_users():

    db = database.get_database_json()
    return db['users']