const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

function generateCode(){
    let code = "";
    for(let i = 0;i < 6;i++)code += letters[Math.floor(Math.random() * letters.length)];
    return code;
}

warn = document.querySelector("#warnCode");
codeHTML = document.getElementById("code");
submitBtn = document.querySelector("input[type=submit]");
let code = generateCode();
codeHTML.innerText = code;

submitBtn.addEventListener("click", function (ev) {
    
    userCode = document.querySelector("input[name=code]");
    country = document.querySelector("select");
    if(country.selectedIndex === 0)
    {
        ev.preventDefault();
    }
    if(userCode.value.trim() !== code)
    {
        ev.preventDefault();
        warn.style.display = "block";
        code = generateCode();
        codeHTML.innerText = code;
    }
})



