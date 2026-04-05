def get_longest_alpha_order(string: str):
    
    res = [string[0]]
    current_letter_ascii = ord(string[0].lower())

    for letter in string[1:]:

        letter_ascii = ord(letter.lower())

        if letter_ascii >= current_letter_ascii:
            res.append(letter)
            current_letter_ascii = letter_ascii
        else:
            break
    
    return ''.join(res)

while True:
    string = input("Insert Your String: ")
    if string != "" and string.isalpha(): break
    print("Invalid String... it must not be empty and contains no integers.")

print(get_longest_alpha_order(string))