{
    console.log("Task 7\n____________________________");
    let array = ["hi", "international", "cat", "sun"];
    console.log(array.reduce((previous, current)=>
    {
        if(previous.length < current.length)
            return current;
        return previous;
    }, ""))
}