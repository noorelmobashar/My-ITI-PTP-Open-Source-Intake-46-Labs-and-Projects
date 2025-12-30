{
    console.log("Task 4\n____________________________");
    let array = [10, 30, 50, 20, 40];
    let firstMax = array[0], secondMax = array[0];
    for(let i = 1;i < array.length;i++)
    {
        if(array[i] >= firstMax)
        {
            secondMax = firstMax;
            firstMax = array[i];
        }
        else if(array[i] >= secondMax || i == 1)
        {
            secondMax = array[i];
        }

    }
    console.log(secondMax);
}