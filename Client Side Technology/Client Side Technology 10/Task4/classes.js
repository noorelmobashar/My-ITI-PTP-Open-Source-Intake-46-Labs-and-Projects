class Bird
{
    static birds = [];
    static deadBirds = [];
    static #start = false;

    constructor(imgElement)
    {
        this.imgElement = imgElement;
        this.direction = Math.random() < 0.5 ? -1 : 1;
        this.imgElement.src = this.direction == -1 ? "images/bird.png" : "images/reverseBird.png";
        this.posX = this.direction == 1 ? 0 : 1350;
        this.posY = Math.random() * 300;
        this.imgElement.style.top = `${this.posY}px`;
        this.imgElement.style.left = `${this.posX}px`;
        this.isDead = false;
        this.isDeleted = false;
    }

    static startGame()
    {
        if(!Bird.#start)
        {
            Bird.#start = true;
            setInterval(()=>{
                let newImgElement = document.createElement("img");
                newImgElement.classList.add("bird");
                document.querySelector("body").append(newImgElement);
                let newBird = new Bird(newImgElement);
                newImgElement.addEventListener("click", function(){
                    newBird.die();
                })
                Bird.birds.push(newBird);
            }, 1000);

            setInterval(()=>{
                for(let bird of Bird.birds)
                {
                    if(!bird.isDead)
                    {
                        bird.move();
                    }
                }
                Bird.birds = Bird.birds.filter((obj)=>!obj.isDead);
            }, 10);
            
            setInterval(()=>{
                for(let deadBird of Bird.deadBirds)
                {
                    deadBird.posY += 2;
                    deadBird.imgElement.style.top = `${deadBird.posY}px`;
                    if(deadBird.posY >= 400)
                    {
                        deadBird.isDeleted = true;
                        deadBird.imgElement.remove();
                    }

                }
                Bird.deadBirds = Bird.deadBirds.filter((obj) => !obj.isDeleted);
            }, 10);
        }
    }
    move()
    {
        this.posX += 2 * this.direction;
        this.imgElement.style.left = `${this.posX}px`;
        if(this.posX >= 1350 || this.posX <= 0)
        {
            this.direction *= -1;
            this.imgElement.src = this.direction == -1 ? "images/bird.png" : "images/reverseBird.png";
        }
    }

    die()
    {
        this.imgElement.src = "images/deadBird.png";
        this.isDead = true;
        Bird.deadBirds.push(this);
    }

}