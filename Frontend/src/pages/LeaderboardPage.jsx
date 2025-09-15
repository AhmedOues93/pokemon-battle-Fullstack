import { useEffect, useState } from "react";
import { API_URL } from "../api/api.js";

export default function LeaderboardPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_URL}/leaderboard?limit=10`);
        if (!res.ok) throw new Error("Failed to load leaderboard");
        const json = await res.json();
        setRows(json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return <div className="p-6 text-white">Loading…</div>;
  if (error) return <div className="p-6 text-red-300">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-extrabold mb-4">Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-black/30  border border-white/20 rounded-xl overflow-hidden">
          <thead className="bg-green-400 text-black ">
            <tr>
              <th className="text-left px-4 py-2">#</th>
              <th className="text-left px-4 py-2">Player</th>
              <th className="text-left px-4 py-2">Score</th>
              <th className="text-left px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r._id} className="odd:bg-white/5">
                <td className=" px-4py-2">{i + 1}</td>
                <td className="px-1   font-bold py-2">{r.userName}</td>
                <td className="px-4 py-2 font-bold">{r.score}</td>
                <td className="px-4 py-2">
                  {new Date(r.date || r.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
