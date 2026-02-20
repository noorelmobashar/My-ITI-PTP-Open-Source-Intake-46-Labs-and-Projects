import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.*;

class Country {
    private String code;
    private String name;
    private String continent;
    private double surfaceArea;
    private int population;
    private double gnp;
    private int capital;

    public Country(String code, String name, String continent, double surfaceArea, int population, double gnp, int capital) {
        this.code = code;
        this.name = name;
        this.continent = continent;
        this.surfaceArea = surfaceArea;
        this.population = population;
        this.gnp = gnp;
        this.capital = capital;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContinent() { return continent; }
    public void setContinent(String continent) { this.continent = continent; }

    public double getSurfaceArea() { return surfaceArea; }
    public void setSurfaceArea(double surfaceArea) { this.surfaceArea = surfaceArea; }

    public int getPopulation() { return population; }
    public void setPopulation(int population) { this.population = population; }

    public double getGnp() { return gnp; }
    public void setGnp(double gnp) { this.gnp = gnp; }

    public int getCapital() { return capital; }
    public void setCapital(int capital) { this.capital = capital; }

}

class City {
    private int id;
    private String name;
    private int population;
    private String countryCode;

    public City(int id, String name, int population, String countryCode) {
        this.id = id;
        this.name = name;
        this.population = population;
        this.countryCode = countryCode;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getPopulation() { return population; }
    public void setPopulation(int population) { this.population = population; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

}
public class Exercise1 {
    public static void main(String[] args) throws IOException {
        String fileName1 = "src/Countries.csv";
        String fileName2 = "src/Cities.csv";

        List<Country> countries = Files.lines(Paths.get(fileName1))
                .skip(1) // Skip the CSV header row
                .map(line -> {
                    String[] parts = line.split(",");
                    return new Country(
                            parts[0].trim(),             // code
                            parts[1].trim(),             // name
                            parts[2].trim(),             // continent
                            Double.parseDouble(parts[3]), // surfaceArea
                            Integer.parseInt(parts[4]),   // population
                            Double.parseDouble(parts[5]), // gnp
                            Integer.parseInt(parts[6])    // capital
                    );
                })
                .collect(Collectors.toList());

        List<City> cities = Files.lines(Paths.get(fileName2))
                .skip(1) // Skips the header row (ID, Name, Population, CountryCode)
                .map(line -> {
                    // Splitting by comma - assumes no commas inside the city names
                    String[] parts = line.split(",");
                    return new City(
                            Integer.parseInt(parts[0].trim()), // id
                            parts[1].trim(),                   // name
                            Integer.parseInt(parts[2].trim()), // population
                            parts[3].trim()                    // countryCode
                    );
                })
                .collect(Collectors.toList());

        Map<String, String> mostPopCities = cities.stream()
                .sorted(
                        (city1, city2) ->
                                city1.getPopulation() >= city2.getPopulation() ? -1 : 1
                )
                .collect(
                        toMap(
                                (city -> {
                                    for(Country country: countries)
                                    {
                                        if(country.getCode().equals(city.getCountryCode()))
                                        {
                                            return country.getName();
                                        }
                                    }
                                    return city.getCountryCode();
                                }),
                                City::getName,
                                (existing, replacement) -> existing,
                                LinkedHashMap::new
                        )
                );

        System.out.println(mostPopCities);

        Map<String, String> mostPopCountries = countries.stream()
                .sorted(
                        (country1, country2) ->
                                country1.getPopulation() >= country2.getPopulation() ? -1 : 1
                )
                .collect(
                        toMap(
                                Country::getContinent,
                                Country::getName,
                                (existing, replacement) -> existing,
                                LinkedHashMap::new
                        )
                );


        System.out.println(mostPopCountries);


        System.out.println(
                cities.stream()
                        .filter(city -> {
                            for(Country country: countries)
                            {
                                if(city.getId() == country.getCapital())
                                    return true;
                            }
                            return false;
                        })
                        .max(((city1, city2) -> city1.getPopulation() >= city2.getPopulation() ? 1 : -1))
                        .map(City::getName)
                        .get()
        );
    }


}