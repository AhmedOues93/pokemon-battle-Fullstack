import { useState } from "react";

export default function PlayerNamePrompt({ onSave }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    const v = name.trim();
    if (v.length < 2) {
      setError("Please enter at least 2 characters.");
      return;
    }
    onSave(v);
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white/10 border border-white/20 rounded-2xl p-5 text-white">
      <h2 className="text-2xl font-bold mb-2">Choose your player name</h2>
      <p className="opacity-80 mb-3">
        This name will be used on the leaderboard.
      </p>
      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-xl text-black"
          placeholder="Player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-green-400 text-black font-bold"
        >
          Save
        </button>
      </div>
      {error && <p className="text-red-300 mt-2">{error}</p>}
    </div>
  );
}
