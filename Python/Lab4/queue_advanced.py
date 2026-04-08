from queue import Queue
from database import *

class QueueAdvanced(Queue):

    queues = get_database_json()

    def __init__(self, name, maxsize):

        super().__init__()

        if str(name) in self.queues:
            print("Queue name already exists, choose another name..")
        
        if not isinstance(maxsize, int) or maxsize < 0:
            print("maxsize must be a non-negative integer")

        self.__name = name
        self.__maxsize = maxsize
        self._update_queues()

    def _update_queues(self):
        QueueAdvanced.queues[str(self.__name)] = self._to_dict()
        self.save()

    def insert(self, value):
        if len(self._Queue__items) >= self.__maxsize:
            print("WARNING: Queue is full")
            return

        super().insert(value)
        self._update_queues()

    def pop(self):
        value = super().pop()
        self._update_queues()
        return value

    @classmethod
    def load(cls):
        cls.queues = get_database_json()
        return cls.queues
    
    @classmethod
    def save(cls):
        set_database_json(cls.queues)

    def _to_dict(self):
        return {
            "name": self.__name,
            "maxsize": self.__maxsize,
            "items": list(self._Queue__items),
        }