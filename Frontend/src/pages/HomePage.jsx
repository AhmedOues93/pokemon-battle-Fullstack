import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function HomePage() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=40");
        const data = await res.json();
        setPokemons(data.results || []);
      } catch (e) {
        console.error(e);
        setError("Failed to load Pokémon list.");
      } finally {
        setLoading(false);
      }
    };
    fetchPokemons();
  }, []);

  if (loading) return <h2 className="text-white p-8">Loading…</h2>;
  if (error) return <h2 className="text-red-300 p-8">{error}</h2>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow mb-6">
        Pokémon List
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
        {pokemons.map((pokemon, index) => (
          <Link
            to={`/details/${pokemon.name}`}
            key={pokemon.name}
            className="group relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 shadow-md hover:shadow-2xl hover:border-yellow-300/60 transition-all duration-300"
          >
            <div className="flex items-center justify-center">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                  index + 1
                }.png`}
                alt={pokemon.name}
                className="h-24 w-24 object-contain drop-shadow transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <h3 className="mt-3 text-center font-semibold text-white capitalize tracking-wide group-hover:text-yellow-300">
              {pokemon.name}
            </h3>
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 transition-all duration-300 group-hover:ring-2 group-hover:ring-yellow-300/50" />
          </Link>
        ))}
      </div>
    </div>
  );
}
