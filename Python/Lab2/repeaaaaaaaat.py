total = 0
count = 0

while True:
    try:
        inp = input("Enter a Number (or done to terminate): ")

        if inp.lower() == "done":
            break

        number = int(inp)
        total += number
        count += 1
    except:
        print("Invalid Number...")

print(f"Total: {total}")
print(f"Count: {count}")
try:
    print(f"Average: {total/count}")
except ZeroDivisionError:
    print(f"Average: 0")