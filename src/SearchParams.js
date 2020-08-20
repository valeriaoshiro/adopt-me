import React, { useState, useEffect, useContext } from "react";
import Results from "./Results";
import useDropdown from "./useDropdown";
import ThemeContext from "./ThemeContext";
import { Client } from "@petfinder/petfinder-js";

const SearchParams = () => {
  const [location, setLocation] = useState("Los Angeles, CA");
  const [animalType, setAnimalType] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [animal, AnimalDropdown] = useDropdown("Animal", "dog", animalType);
  const [breed, BreedDropdown, setBreed] = useDropdown("Breed", "", breeds);
  const [pets, setPets] = useState([]);
  const [theme, setTheme] = useContext(ThemeContext);
  let petFinder = new Client({
    apiKey: process.env.REACT_APP_PET_FINDER_API_KEY,
    secret: process.env.REACT_APP_PET_FINDER_SECRET,
  });

  async function requestPets() {
    petFinder.animal
      .search({
        location,
        breed,
        type: animal,
      })
      .then((resp) => {
        setPets(resp.data.animals);
      });
  }

  useEffect(() => {
    petFinder.animalData.types().then((resp) => {
      let types = [];
      resp.data.types.forEach((pet) => {
        types.push(pet.name);
      });
      setAnimalType(types);
    });
  }, []);

  useEffect(() => {
    setBreeds([]);
    setBreed("");

    petFinder.animalData.breeds(animal).then((resp) => {
      const breedStrings = resp.data.breeds.map(({ name }) => name);
      setBreeds(breedStrings);
    }, console.error);
  }, [animal, setBreed, setBreeds]);

  return (
    <div className="search-params">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          requestPets();
        }}
      >
        <label htmlFor="location">
          Location
          <input
            id="location"
            value={location}
            placeholder="Location"
            onChange={(event) => {
              setLocation(event.target.value);
            }}
          />
        </label>
        <AnimalDropdown />
        <BreedDropdown />
        <label>
          Theme
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onBlur={(e) => setTheme(e.target.value)}
          >
            <option value="darkblue">Dark Blue</option>
            <option value="red">Red</option>
            <option value="peru">Peru</option>
            <option value="yellow">Yellow</option>
            <option value="green">Green</option>
          </select>
        </label>
        <button style={{ background: theme }}>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;
