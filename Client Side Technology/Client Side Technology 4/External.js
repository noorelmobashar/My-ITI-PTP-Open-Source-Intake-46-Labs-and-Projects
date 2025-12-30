//console.log(number1);
//console.log(number2);
//console.log(number3);
// let number1 = 3;
// let number2 = 2.9;
// let number3 = 0xff;
// var firstName = "Nooreldeen";
// var secondName = 'Ayman';
// var lastName = `Elmobashar`;
// let flag = true;
// console.log("This is the External JavaScript File.")
// firstName[3] = 'A';
// console.log(firstName);
// console.log(typeof firstName);
// console.log(typeof secondName);
// console.log(typeof lastName);
// console.log(typeof number1);
// console.log(typeof number2);
// console.log(typeof number3);

function checkEO(number)
{
    if(number%2)console.log("ODD");
    else console.log("EVEN");
}

function printNums()
{
    for(let i = 0;i < 11;i++)console.log(i);
}

function checkNP(number)
{
    if(number > 0)console.log("+ve");
    else if(number < 0)console.log("-ve");
    else console.log("Zero");
}

function mulTable(number)
{
    for(let i = 1;i < 13;i++)
    {
        console.log(`${number} * ${i} = ${number*i}`);
    }
}

function printDay(number)
{
    switch(number)
    {
        case 1:
            console.log("Sunday");
            break;
        case 2:
            console.log("Monday");
            break;
        case 3:
            console.log("Tuesday");
            break;
        case 4:
            console.log("Wednesday");
            break;
        case 5:
            console.log("Thursday");
            break;
        case 6:
            console.log("Friday");
            break;
        case 7:
            console.log("Saturday");
            break;
        default:
            console.log("Invalid Number");
            break;
    }
}

function checkDE(number)
{
    switch(number)
    {
        case 1:
        case 7:
            console.log("Weekend");
            break;
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            console.log("Weekday");
            break;
        default:
            console.log("Invalid Number");
            break;
    }  
}

