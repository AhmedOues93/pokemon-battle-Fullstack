import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRoster } from "../hooks/useRoster.js";

export default function PokemonDetailsPage() {
  const { name } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { add } = useRoster();

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!res.ok) throw new Error("Not found");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError("Failed to load Pokémon.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [name]);

  if (loading) return <div className="p-6 text-white">Loading…</div>;
  if (error || !data)
    return <div className="p-6 text-red-300">{error || "No data"}</div>;

  const sprite =
    data.sprites?.other?.["official-artwork"]?.front_default ||
    data.sprites?.front_default;
  const baseStats =
    data.stats?.map((s) => ({ name: s.stat.name, val: s.base_stat })) || [];
  const types = data.types?.map((t) => t.type.name) || [];

  const addToRoster = () => {
    add({
      id: data.id,
      name: data.name,
      sprite,
      types,
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <div className="flex flex-col md:flex-row gap-8 bg-white/10 border border-white/20 rounded-2xl p-6">
        <img
          src={sprite}
          alt={data.name}
          className="w-64 h-64 object-contain self-center"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold capitalize mb-2">
            {data.name}
          </h1>
          <p className="mb-4">
            Types: <span className="capitalize">{types.join(", ")}</span>
          </p>
          <h2 className="text-2xl font-bold mb-2">Stats</h2>
          <ul className="grid grid-cols-2 gap-2">
            {baseStats.map((s) => (
              <li
                key={s.name}
                className="bg-white/10 rounded-xl px-3 py-2 flex justify-between"
              >
                <span className="capitalize">{s.name}</span>
                <span>{s.val}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={addToRoster}
            className="mt-6 px-4 py-2 bg-yellow-400 text-black font-bold rounded-xl hover:brightness-110"
          >
            Add to My Roster
          </button>
        </div>
      </div>
    </div>
  );
}
