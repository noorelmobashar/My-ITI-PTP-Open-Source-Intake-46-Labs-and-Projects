{
    console.log("Task 10\n____________________________");

    const processDate=(date)=>
    {
        let today = "2025-11-19".split("-").map(Number), days = 0;
        date = date.split("-").map(Number);
        days += (today[0] - date[0]) * 365;
        days += (today[1] - date[1]) * 30;
        days += (today[2] - date[2]);
        return days;
    }
    let dates = ["2024-01-01", "2024-03-01", "2024-04-15"];
    console.log(dates.map(processDate));
}