//Task 2.1

{
    console.log(`*******Task 2.1********`);
    names = ['Sara', 'Ali', 'Mona'];
    ages = [20, 22, 19];
    let persons = [];
    for(let i = 0;i < names.length;i++)
    {
        persons.push({name: names[i], age: ages[i]});
    }
    console.log(persons);
    console.log(`___________________\n\n`);
}

//Task 2.2

{
    console.log(`\n\n*******Task 2.2********`);
    let counts = {};
    let chars = ['a', 'b', 'a', 'c', 'b', 'a'];
    for(let char of chars)
    {
        if(char in counts) counts[char]++;
        else counts[char] = 1;
    }
    console.log(counts);
    console.log(`___________________\n\n`);
}

//Task 2.3

{
    console.log(`\n\n*******Task 2.3********`);
    let marks = [95, 82, 60, 45, 77, 88];
    let grades = {A: [], B: [], C: [], D: [], F:[]};
    for(let mark of marks)
    {
        if(mark >= 90) grades.A.push(mark);
        else if(mark >= 80) grades.B.push(mark);
        else if(mark >= 70) grades.C.push(mark);
        else if(mark >= 60) grades.D.push(mark);
        else grades.F.push(mark);
    }
    console.log(grades);
    console.log(`___________________\n\n`);
}

//Task 2.4
{
    console.log(`\n\n*******Task 2.4********`);
    const toPascalCase = (string) => string[0].toUpperCase() + string.substr(1).toLowerCase();
    let persons = [{name:"ahmed", grade:90}, {name:"mona", grade:80}];
    persons = persons.map(obj=>{
        obj.name = toPascalCase(obj.name);
        return obj;
    });
    console.log(persons);
    console.log(`___________________\n\n`);
}

//Task 2.5
{
    console.log(`\n\n*******Task 2.5********`);
    let persons = [{name:"Ali", grade:70}, {name:"Sara", grade:95}];
    persons.sort((obj1, obj2) => obj2.grade - obj1.grade);
    console.log(persons);
    console.log(`___________________\n\n`);
}

//Task 2.6
{
    console.log(`\n\n*******Task 2.6********`);
    let persons = [{name:"Ali", grade:70}, {name:"Sara", grade:95}];
    highestStudentGrade = persons.reduce((prev, current) => Math.max(prev, current.grade), 0);
    highestStudent = persons.find(obj=>obj.grade==highestStudentGrade);
    console.log(highestStudent);
    console.log(`___________________\n\n`);
}

//Task 2.7
{
    console.log(`\n\n*******Task 2.7********`);
    let persons = [{name:"Ali", grade:55}, {name:"Sara", grade:95}, {name:"Mona", grade:62}];
    personsGreaterThan60 = persons.filter(obj => obj.grade >= 60);
    console.log(personsGreaterThan60);
    console.log(`___________________\n\n`);
}

//Task 2.8
{
    console.log(`\n\n*******Task 2.8********`);
    let persons = [{name:"Ali", grade:70}, {name:"Sara", grade:95}];
    personsString = persons.map(obj=>`${obj.name} ${obj.grade}`);
    console.log(personsString);
    console.log(`___________________\n\n`);
}

//Task 2.9
{
    console.log(`\n\n*******Task 2.9********`);
    let persons = [{name:"Ali"}, {name:"Mona"}, {name:"Zyad"}];
    presonsGreaterThan3Letters = persons.filter(obj => obj.name.length > 3);
    console.log(presonsGreaterThan3Letters);
    console.log(`___________________\n\n`);
}

//Task 2.10
{
    console.log(`\n\n*******Task 2.10********`);
    const createBook = (title, author, year, price) =>
    {
        return {
            title,
            author,
            year,
            price,
            details(){
                return `Book title: ${this.title}\nBook Author: ${this.author}\nBook Year: ${this.year}\nBook Price: ${this.price}`;
            },
            isClassic(){
                return 2025 - this.year > 20;
            },
            ApplyDiscount(percent){
                this.price -= this.price * (percent / 100);
            }
        }
    }

    let books = [
        createBook("ITI", "Noor", 2000, 250),
        createBook("NTI", "Ahmed", 2010, 200),
        createBook("Creativa", "Kareem", 2020, 950),
    ]

    for(let book of books) console.log(book.details());
    
    for(let book of books) console.log(`${book.title} is classic? -> ${book.isClassic()}`);

    books.map(obj => {
        if(2025 - obj.year > 10) obj.ApplyDiscount(10);
    });

    for(let book of books) console.log(book.details());

    console.log(`___________________\n\n`);

}
