import json
from pathlib import Path

"""
Schema
{
    name: Queue,
    name: Queue
}
"""

DATABASE_PATH = Path('models/database.json')


def _json_default(value):
    return value.__dict__


def set_database_json(data):

    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

    with DATABASE_PATH.open('w') as file:
        json.dump(data, file, indent=4, default=_json_default)


def get_database_json():

    try:
        with DATABASE_PATH.open('r') as file:
            return json.load(file)
    except FileNotFoundError:
        data = {}
        set_database_json(data)
        return data
        
