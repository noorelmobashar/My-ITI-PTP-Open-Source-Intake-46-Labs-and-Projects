class Egg
{
    static eggs = [];
    static #started = false;
    constructor(imgElement)
    {
        this.imgElement = imgElement;
        this.posX = 210 + (Math.random() * 530);
        this.posY = 130;
        this.imgElement.style.left = `${this.posX}px`;
        this.imgElement.style.top = `${this.posY}px`;
        this.isDead = false;
    }
    static startFalling()
    {
        if(!Egg.#started)
        {
            Egg.#started = true;
            setInterval(() => {
                let newImgElement = document.createElement("img");
                newImgElement.src = "resources/egg.jpg";
                newImgElement.classList.add("egg");
                document.querySelector("#gameFrame").append(newImgElement);
                let newEgg = new Egg(newImgElement);
                Egg.eggs.push(newEgg);

            }, 700 + parseInt(Math.random()*1000));
            setInterval(() => {
                for(let egg of Egg.eggs)
                {
                    if(!egg.isDead)
                    {
                        egg.moveDown();
                        egg.checkCollision();
                    }
                }
                Egg.eggs = Egg.eggs.filter((obj) => !obj.isDead);
            }, 10)
        }
    }
    moveDown()
    {
        this.posY += 2;
        this.imgElement.style.top = `${this.posY - 130}px`;
    }
    die()
    {
        this.imgElement.src = "resources/crackedEgg.jpg";
        this.isDead = true;
        setTimeout(() => {
            this.imgElement.remove();
        },2000);

    }

    checkCollision()
    {
        if(this.posY > 700)
        {
            this.die();
            return;
        }
        //basket goes from -250 to 250 with width 100
        //Egg goes from 190 to 730 with width 50
        let basket = document.querySelector("#basket");
        let basketPosX = parseInt(basket.style.left.substr(0, basket.style.left.length-2));
        if(this.posY - 500 > 100 && this.posX - 430 - basketPosX > -30 && this.posX - 430 - basketPosX < 80 && !this.isDead)
        {
            this.imgElement.remove();
            this.isDead = true;
            document.querySelector("#score").innerText = parseInt(document.querySelector("#score").innerText) + 1;
        }
    }
};