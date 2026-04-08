import regex
from views import users

# ( )

def register_user() -> None:

    while True:

        f_name = input("Insert Your First Name: ")
        if not (f_name == "" or not f_name.isalpha()): break
        print("Please insert a valid name")

    while True:

        l_name = input("Insert Your Last Name: ")
        if not (l_name == "" or not l_name.isalpha()): break
        print("Please insert a valid name")

    while True:

        email = input("Insert Your Email: ")
        if regex.fullmatch(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", email): break
        print("Please insert a valid email")  

    while True:

        password = input("Insert Your Password: ")
        if regex.fullmatch(r"^(?=(?:\D*\d){8,})(?=.*[a-zA-Z]).+$", password): break
        print("Please insert a valid password")

    while True:

        confirm_password = input("Insert Your Confirm Password: ")
        if password == confirm_password: break
        print("Passwords do not match")

    while True:

        mobile_phone = input("Insert Your Mobile Phone: +2")
        if regex.fullmatch(r"^01[0125][0-9]{8}$", mobile_phone): break
        print("Please insert a valid egyptian phone number")

    data = {
        "f_name": f_name,
        "l_name": l_name,
        "email": email,
        "password": password,
        "mobile_phone": mobile_phone
    }

    users.create_user(data)


def login_user() -> dict:
    
    while True:

        email = input("Insert Your Email: ")
        if regex.fullmatch(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", email): break
        print("Please insert a valid email")  

    password = input("Insert Your Password: ")

    user = users.get_user(email)
    if password == user['password']:
        return user
    return {}

def verify_email(email: str, otp: str) -> bool:

    user = users.get_user("email")
    if user:
        if otp == "0000":
            user["is_email_verified"] = True
            users.update_user(user)
            return True
    return False


