import random

words = ['apple', 'banana', 'kiwi', 'pineapple', 'grape']
word = [*random.choice(words)]

while True:

    name = input("Insert Your Name: ")
    if not (name == "" or not name.isalpha()): break
    print("Please insert a valid name")

placements = ['_'] * len(word)
turns = 7
correct_guesses = 0

while turns and correct_guesses != len(word):

    print("="*30)
    print(' '.join(placements))

    char = input("\nMake a Guess (insert a single character): ")

    if len(char) != 1 or not char.isalpha():

        print("Invalid Input...")
        continue

    if char in word:

        ind = word.index(char)
        placements[ind] = char
        word[ind] = '_'
        correct_guesses += 1
        print("\nYour Guess is Correct!")

        if correct_guesses == len(word):
            print("\nYou Correctly Guessed The Word!\nThe Word is: ", ''.join(placements))

    else:

        turns -= 1
        print("\nYou Failed This Guess... Your remaining turns are ", turns)

        if(turns == 0):
            print("\nYou exceeded the number of turns, Game Over!")



    
