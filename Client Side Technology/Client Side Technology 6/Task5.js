{
    console.log("Task 5\n____________________________");
    let array = ['a', 'b', 'c', 'd', 'e'];
    console.log("Even index: ", array.filter((number, index)=>!(index&1)));
    console.log("Odd index: ", array.filter((number, index)=>index&1));
}
