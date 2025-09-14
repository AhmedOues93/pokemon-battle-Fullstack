import { useRoster } from "../hooks/useRoster.js";
import { Link } from "react-router";

export default function MyRosterPage() {
  const { roster, removeByName, clear } = useRoster();

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-extrabold">My Roster</h1>
        {roster.length > 0 && (
          <button
            className="px-3 py-2 rounded-xl bg-white/10 border border-white/20"
            onClick={clear}
          >
            Clear
          </button>
        )}
      </div>
      {roster.length === 0 ? (
        <p>
          No Pokémon yet. Go pick some on the{" "}
          <Link className="underline" to="/">
            Home
          </Link>{" "}
          page.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {roster.map((p) => (
            <div
              key={p.name}
              className="bg-white/10 border border-white/20 rounded-2xl p-4"
            >
              <Link to={`/details/${p.name}`} className="block text-center">
                <img
                  src={p.sprite}
                  alt={p.name}
                  className="w-24 h-24 object-contain mx-auto"
                />
                <h3 className="mt-2 font-semibold capitalize">{p.name}</h3>
                <p className="text-sm opacity-80 capitalize">
                  {p.types.join(", ")}
                </p>
              </Link>
              <button
                onClick={() => removeByName(p.name)}
                className="mt-3 w-full px-3 py-2 rounded-xl bg-red-400 text-black font-bold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
