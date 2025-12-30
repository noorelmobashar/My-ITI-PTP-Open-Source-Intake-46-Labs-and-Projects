{
    console.log("Task 1\n____________________________");
    let array = [1, 2, 2, 3, 4, 4, 5];

    //Using Set
    let numbersUsingSet = new Set(array);
    console.log(numbersUsingSet);

    //Without using Set
    array.sort((a, b)=> a-b);
    let numbersWithoutSet = [array[0]];
    for(let i = 1;i < array.length;i++)
    {
        if(array[i] != numbersWithoutSet[numbersWithoutSet.length - 1]) 
            numbersWithoutSet.push(array[i])
    }
    console.log(numbersWithoutSet);
}