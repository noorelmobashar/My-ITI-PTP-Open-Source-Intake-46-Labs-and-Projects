let startBtn = document.querySelector("button");
let gameWindow = document.querySelector("#gameFrame");
let basket = document.querySelector("#basket");
let LeftBottom = 180, rightBottom = 785; currentImgPos = 482;

startBtn.addEventListener("click", function(){
    gameWindow.style.backgroundColor = "white";
    basket.style.display = "inline";
    Egg.startFalling();
    startBtn.remove();
})

gameWindow.addEventListener("mousemove", function(event){

    if(event.screenX < rightBottom - 50 && event.screenX > LeftBottom + 50)
        basket.style.left = `${event.screenX - currentImgPos}px`;



})

