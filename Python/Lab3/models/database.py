import json

"""
Schema
{
    users: 
    [
        {
            id: int,
            f_name: string,
            l_name: string,
            email: string,
            is_email_verified: boolean,
            password: string,
            mobile_phone: string,
        }
    ],
    projects:
    [
        {
            id: int,
            user_id: int,
            title: string,
            total_target: int,
            start_time: date,
            end_time: date
        }
    ]
}
"""

def set_database_json(data):

    with open('models/database.json', 'w') as file:
        json.dump(data, file, indent=4)


def get_database_json():

    try:
        with open('models/database.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        data = {'users': [], 'projects': []}
        set_database_json(data)
        return data
        

