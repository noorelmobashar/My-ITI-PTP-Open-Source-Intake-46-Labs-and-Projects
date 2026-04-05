import regex

while True:

    name = input("Insert Your Name: ")
    if not (name == "" or not name.isalpha()): break
    print("Please insert a valid name")

while True:

    email = input("Insert Your Email: ")
    if regex.fullmatch(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", email): break
    print("Please insert a valid email")  

print(f"Your name: {name}")  
print(f"Your email: {email}")  
