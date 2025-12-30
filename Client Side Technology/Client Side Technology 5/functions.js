{
    const LengthFinder = (string) =>
    {
        console.log(string.length);
    }

    const toUpperCase = (string) =>
    {
        console.log(string.toUpperCase());
    }

    const toLowerCase = (string) =>
    {
        console.log(string.toLowerCase());
    }

    const CharExtractor = (string) =>
    {
        console.log(string[0], string[Math.floor(string.length/2)], string[string.length - 1]);
    }

    const Greet = (firstName, secondName) =>
    {
        console.log(`Hello, ${firstName} ${secondName}!`);
    }

    const CutString = (string) =>
    {
        console.log(string.substr(0, string.length - 5));
    }

    const CheckWord = (string) =>
    {
        console.log(string.includes("Doe"));
    }

    const ReplaceWord = (string) =>
    {
        console.log(string.replaceAll("Doe", "Noor"));
    }

    const CountLetter = (string, letter) =>
    {
        let result = 0;
        for(let i = 0;i < string.length;i++)
        {
            if(string[i] == letter)
                result++;
        }
        console.log(result);
    }

    const CheckStartEnd = (string, word) =>
    {
        console.log(string.startsWith(word) && string.endsWith(word))
    }

    const RemoveSpaces = (string) =>
    {
        console.log(string.replaceAll(" ", ""));
    }

    const ExtractDomain = (string) =>
    {
        console.log(string.substr(string.indexOf("@") + 1, string.length));
    }

    const IntialGen = (string) =>
    {
        let initial = "", flag = 1;
        for(let i = 0;i < string.length;i++)
        {
            if(flag)
            {
                initial += `${string[i].toUpperCase()}.`;
                flag = 0;
            }
            else if(string[i] == ' ')
                flag = 1;
        }
        console.log(initial);
    }

    const Reverse = (string) =>
    {
        let reverse = "";
        for(let i = string.length - 1; i > -1;i--)reverse+=string[i];
        console.log(reverse);
    }

    const IsPalindrome = (string) =>
    {
        let reverse = "";
        for(let i = string.length - 1; i > -1;i--)reverse+=string[i];
        console.log(reverse == string);
    }

    const CountVowels = (string) =>
    {
        let a = 0, e = 0, i = 0, o = 0, u = 0;
        for(let pos = 0; pos < string.length; pos++)
        {
            if(string[pos].toLowerCase() == 'a') a++;
            if(string[pos].toLowerCase() == 'e') e++;
            if(string[pos].toLowerCase() == 'i') i++;
            if(string[pos].toLowerCase() == 'o') o++;
            if(string[pos].toLowerCase() == 'u') u++;
        }
        console.log(`a: ${a}\ne: ${e}\ni: ${i}\no: ${o}\nu: ${u}\n`);
    }

    const TitleCase = (string) =>
    {
        let titleCase = "", flag = 1;
        for(let i = 0;i < string.length;i++)
        {
            if(flag)
            {
                titleCase += `${string[i].toUpperCase()}`;
                flag = 0;
                continue;
            }
            else if(string[i] == ' ')
            {
                flag = 1;
            }
            titleCase += string[i];
        }
        console.log(titleCase);
    }

    const MaskPhone = (string) =>
    {
        let mask = "";
        for(let i = 0;i < string.length - 4;i++)
        {
            mask += "*";
        }
        for(let i = string.length - 4;i < string.length;i++)
        {
            mask += string[i];
        }
        console.log(mask);
    }

    const LongestWord = (string) =>
    {
        let temp = "", maxLength = -1, longest = "";
        for(let i = 0;i < string.length;i++)
        {
            if(string[i] == ' ')
            {
                if(temp.length > maxLength)
                {
                    longest = temp;
                    maxLength = temp.length;
                }
                temp = "";
            }
            else
                temp += string[i];
        }
        console.log(longest);        
    }

    const RemoveRepeated = (string) =>
    {
        let unrepeatedString = string[0];
        for(let i = 1;i < string.length; i++)
        {
            if(string[i] != unrepeatedString[unrepeatedString.length - 1])
            {
                unrepeatedString += string[i];
            }
        }
        console.log(unrepeatedString);
    }

    (LengthFinder("Joh Doe"));
    (toUpperCase("Joh Doe"));
    (toLowerCase("Joh Doe"));
      (CharExtractor("Joh Doooe"));
      (Greet("Joh", "Doe"));
      (CutString("Joh Doe"));
      (CheckWord("Joh Doe"));
      (ReplaceWord("Joh Doe"));
      (CountLetter("Joh Doe", "o"));
      (CheckStartEnd("Joh Doe"));
      (RemoveSpaces("Joh Doe"));
      (ExtractDomain("Joh@Doe.com"));
      (IntialGen("Joh Doe"));
      (Reverse("Joh Doe"));
      (IsPalindrome("Joh Doe"));
      (CountVowels("Joh Doe"));
      (TitleCase("joh doe"));
      (MaskPhone("01222551969"));
      (LongestWord("Joh Doe Ahmed International Noor"));
      (RemoveRepeated("JJOOHHDDOOEE"));

}