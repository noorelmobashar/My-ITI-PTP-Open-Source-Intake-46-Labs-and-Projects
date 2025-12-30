let boxes = document.querySelectorAll(".box");
const addBox = function()
{
    let clonedBox = this.cloneNode();
    clonedBox.addEventListener("click", addBox, this);
    document.querySelector("#boxes").append(clonedBox);
    this.style.cursor = "default";
    this.removeEventListener("click", addBox, this);
}
for(let box of boxes)
{
    box.addEventListener("click", addBox, this);
}