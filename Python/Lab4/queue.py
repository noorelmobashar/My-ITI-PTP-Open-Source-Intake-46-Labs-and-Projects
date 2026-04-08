class Queue:

    def __init__(self):
        self.__items = []

    def insert(self, value):
        self.__items.append(value)

    def pop(self):
        
        if self.__items:
            return self.__items.pop(0)
        
        print("WARNING: Empty Queue")
        return
    
    def is_empty(self):
        return 0 if self.__items else 1
    