def fizz_buzz_check(number: int):

    if not isinstance(number, int):
        raise TypeError
    
    if not (number % 5 or number % 3): return "FizzBuzz"
    if number % 3 == 0: return "Fizz"
    if number % 5 == 0: return "Buzz"

    return "Neither"

while True:
    try:
        number = int(input())
        break
    except:
        print("number must be a number")

print(fizz_buzz_check(number))