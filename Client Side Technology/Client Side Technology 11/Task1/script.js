let countryInput = document.querySelector("input[name=countryName]");
let showBtn = document.querySelector(".showBtn");
let countryWarning = document.querySelector("#countryWarning");
let questionDiv = document.querySelector("#question");
let parentCard = document.querySelector(".parentCard");
let flagImg = document.querySelector(".flag");
let countryName = document.querySelector(".data.country");
let countryRegion = document.querySelector(".data.continent");
let population = document.querySelector("#population");
let language = document.querySelector("#language");
let currency = document.querySelector("#currency");
let neighborDiv = document.querySelector("#neighbor");
let neighborFlag = document.querySelector("#neighbor .flag");
let neighborName = document.querySelector("#neighbor .data.country");
let neighborRegion = document.querySelector("#neighbor .data.continent");
let neighborPopulation = document.querySelector("#neighbor #population");
let neighborLanguage = document.querySelector("#neighbor #language");
let neighborCurrency = document.querySelector("#neighbor #currency");

countryInput.addEventListener("onchange", function()
{
    countryWarning.style.display = 'none';
})

showBtn.addEventListener("click", async function(){
    showBtn.disabled = true;
    showBtn.innerText = "Please Wait";

    let response = await fetch(`https://restcountries.com/v2/name/${countryInput.value}`);
    if(response.status !== 200)
    {
        showBtn.disabled = false;
        showBtn.innerText = "Show";
        countryWarning.style.display = 'block';
    }

    let data = await response.json();
    console.log(data);
    let country = new Country(data);

    let response2 = await fetch(`https://restcountries.com/v2/alpha/${country.neighbor}`);
    if(response.status !== 200)
    {
        showBtn.disabled = false;
        showBtn.innerText = "Show";
        countryWarning.style.display = 'block';
    }

    let data2 = await response2.json();
    let neighborCountry = new Country([data2]);

    flagImg.src = country.imgSrc;
    countryName.innerText = country.name;
    countryRegion.innerText = country.continent;
    population.innerText = country.population + " People";
    language.innerText = country.language;
    currency.innerText = country.currency;

    neighborFlag.src = neighborCountry.imgSrc;
    neighborName.innerText = neighborCountry.name;
    neighborRegion.innerText = neighborCountry.continent;
    neighborPopulation.innerText = neighborCountry.population + " People";
    neighborLanguage.innerText = neighborCountry.language;
    neighborCurrency.innerText = neighborCountry.currency;

    questionDiv.style.display = 'none';
    parentCard.style.display = 'inline-block';
    neighborDiv.style.display = 'inline-block';

})
