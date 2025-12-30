class Country
{
    constructor(response)
    {
        this.name = response[0]["name"];
        this.continent = response[0]["region"];
        this.population = response[0]["population"];
        this.imgSrc = response[0]["flags"]["png"];
        this.currency = response[0]["currencies"][0]["name"];
        this.language = response[0]["languages"][0]["name"];
        this.neighbor = response[0]["borders"][0];
    }
};