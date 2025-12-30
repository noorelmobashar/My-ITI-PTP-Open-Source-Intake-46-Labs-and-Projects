{
    const reverse=(string)=>{
        let result = [];
        for(let i = string.length - 1;i > -1;i--) result.push(string[i]);
        return result.join("");
    }
    console.log("Task 2\n____________________________");
    let array = ["apple", "banana", "mango"];
    console.log(array.map(reverse));
}