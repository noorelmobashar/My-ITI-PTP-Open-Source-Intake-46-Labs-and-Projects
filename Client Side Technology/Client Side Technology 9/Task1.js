//Task 1. a
console.log(`Task 1. a:\n`);
//first method
console.log(document.images)
//second method
console.log(document.querySelectorAll('img'))
console.log(`____________________________\n`);

//Task 1. b
console.log(`Task 1. b:\n`);
console.log(document.querySelectorAll("#cities option"));
console.log(`____________________________\n`);

//Task 1. c
console.log(`Task 1. c:\n`);
console.log(document.querySelectorAll("table")[1].rows);
console.log(`____________________________\n`);

//Task 1. d
console.log(`Task 1. d:\n`);
console.log(document.querySelectorAll(".fontBlue.BGrey"));
console.log(`____________________________\n`);

//Task 2. a
console.log(`Task 2. a:\n`);
let firstAnchor = document.querySelector("a");
console.log(`First Anchor Before Change: ${firstAnchor}`)
firstAnchor.href = "training.com";
firstAnchor.innerText = "Training";
console.log(`First Anchor After Change: ${firstAnchor}`)
console.log(`____________________________\n`);

//Task 2. b
console.log(`Task 2. b:\n`);
for(let image of document.images)
{
    image.style.border = "solid pink 2px";
}
console.log("Changed Images Border");
console.log(`____________________________\n`);

//Task 2. c
console.log(`Task 2. c:\n`);
let courses = "";
for(let cb of document.querySelectorAll("#userData input[type=checkbox]"))
{
    if(cb.checked)
        courses += `${cb.value}\n`;
}
//alert(courses);
console.log(`____________________________\n`);

//Task 2. d
console.log(`Task 2. d:\n`);
let exampleId = document.querySelector("#example");
exampleId.style.backgroundColor = "pink";
console.log(`Background of element with "example" ID has been changed`);
console.log(`____________________________\n`);


//Task 3
console.log(`Task 3:\n`);

setInterval(() => {
    date = Date();
    document.title = date.toLocaleString();
    console.log("Time Changed!")
}, 1000);
console.log(`____________________________\n`);


//Task 4
console.log(`Task 4:\n`);

const startSliding = (img, status = 0) =>
{
    let shift = 5, count = 0;
    if(status)
        img.style.left = `${Math.floor(Math.random() * (window.innerWidth - 200))}px`;
    else
        img.style.left = "0px";
    let id = setInterval (
        () => {
            currentPos = parseInt(img.style.left.substr(0, img.style.left.length - 2));
            img.style.left = `${currentPos + shift}px`;

            if(count % 10 == 0 && img == document.images[0])
                img.src = `images/${Math.ceil(Math.random() * 4)}.png`
            if(shift + img.width > window.innerWidth - currentPos)
                shift = -shift;
            if(currentPos < 0)
                shift = Math.abs(shift);
            count++;
        }
        , 30
    )
    return id;
}

const stopSliding = (id) =>
{
    clearInterval(id);
}


//Task 5
document.images[2].style.border = 0;
document.images[3].style.border = 0;
document.images[4].style.border = 0;
startSliding(document.images[2], 1);
startSliding(document.images[3], 1);
startSliding(document.images[4], 1);


