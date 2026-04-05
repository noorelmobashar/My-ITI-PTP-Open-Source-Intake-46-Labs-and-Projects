def generate_array(length: int, start: int):
    
    if not (isinstance(length, int) and isinstance(start, int)):
        raise TypeError("Length and Start must be integers")
    
    if length < 0:
        raise TypeError("Length must be greater than 0")
    
    return [*range(start, start + length)]

while True:
    try:
        length, start = map(int, input("Insert Length and Start separated by space: ").split())
        break
    except:
        print("Length and Start must be a number")

arr = generate_array(length, start)
print(*arr)