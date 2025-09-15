import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "https://pokeapi.co/api/v2/pokemon";
const LIMIT = 20; 


function getIdFromUrl(url) {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

export default function HomePage() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);      
  const [total, setTotal] = useState(0);   
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const offset = page * LIMIT;
        const res = await fetch(`${API}?limit=${LIMIT}&offset=${offset}`);
        if (!res.ok) throw new Error("Failed to load Pokémon");
        const data = await res.json();

        const mapped = (data.results || []).map((p) => {
          const id = getIdFromUrl(p.url);
          return {
            name: p.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          };
        });

        if (!aborted) {
          setList(mapped);
          setTotal(data.count || 0);
        }
      } catch (e) {
        if (!aborted) setError(e.message || "Error");
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [page]);

  const totalPages = Math.ceil(total / LIMIT);
  const hasPrev = page > 0;
  const hasNext = page + 1 < totalPages;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow mb-6">
        Pokémon
      </h1>

      {loading && <p className="text-blue-300">Loading…</p>}
      {error && <p className="text-red-300">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
            {list.map((p) => (
              <Link
                key={p.name}
                to={`/details/${p.name}`}
                className="group relative rounded-2xl border border-white/20 bg-black/30 backdrop-blur-sm p-4 shadow-md hover:shadow-2xl hover:border-yellow-300/60 transition-all duration-300"
              >
                <div className="flex items-center justify-center">
                  <img
                    src={p.sprite}
                    alt={p.name}
                    loading="lazy"
                    className="h-24 w-24 object-contain drop-shadow transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="mt-3 text-center font-semibold text-white capitalize tracking-wide group-hover:text-yellow-300">
                  {p.name}
                </h3>
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 transition-all duration-300 group-hover:ring-2 group-hover:ring-yellow-300/50" />
              </Link>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={!hasPrev}
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white disabled:opacity-40 hover:border-yellow-300/60 hover:shadow transition"
            >
              Prev
            </button>

            <span className="text-white/80">
              Page {totalPages ? page + 1 : 0} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => (hasNext ? p + 1 : p))}
              disabled={!hasNext}
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white disabled:opacity-40 hover:border-yellow-300/60 hover:shadow transition"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

