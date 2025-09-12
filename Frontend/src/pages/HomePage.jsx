/*import React from "react";
import { useState, useEffect } from "react";

const HomePage = () => {
  const { pokemons, setPokemons } = useState([]);
  const { loading, setLoading } = useState(true);

  useEffect(() => {
    const Url = "https://pokeapi.co/api/v2/pokemon/ditto";
     const fetchPokemons = async () => {
      try {
        const response = await fetch(Url);
        const data = await response.json();
        setPokemons(data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pokemnons", error);
      } finally {
        setLoading(false);
      }

    fetchPokemons();
  }, []);

  if (loading) return
  <p className="text-blau-300 ">Loading Pokemon..</p> 
  
  return
  <div>

  
</div>;
};

export default HomePage;*/

import React, { useState, useEffect } from "react";

const HomePage = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=20"
      );
      const data = await response.json();
      setPokemons(data.results);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>Pokemon List</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {pokemons.map((pokemon, index) => (
          <div
            key={pokemon.name}
            style={{ border: "1px solid #ccc", padding: "10px" }}
          >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                index + 1
              }.png`}
              alt={pokemon.name}
            />
            <h3>{pokemon.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
