import { useMemo, useState } from "react";
import { useRoster } from "../hooks/useRoster.js";
import { usePlayerName } from "../hooks/usePlayerName.js";
import PlayerNamePrompt from "../components/PlayerNamePrompt.jsx";
import { API_URL } from "../lib/api.js";
import { useNavigate } from "react-router-dom";

const TYPE_ADV = {
  fire: ["grass", "ice", "bug", "steel"],
  water: ["fire", "ground", "rock"],
  grass: ["water", "ground", "rock"],
  electric: ["water", "flying"],
  ground: ["electric", "fire", "poison", "rock", "steel"],
  rock: ["fire", "ice", "flying", "bug"],
  fighting: ["normal", "ice", "rock", "dark", "steel"],
  psychic: ["fighting", "poison"],
  ice: ["grass", "ground", "flying", "dragon"],
  dark: ["psychic", "ghost"],
  ghost: ["ghost", "psychic"],
  dragon: ["dragon"],
  fairy: ["dragon", "dark", "fighting"],
};

function advantageMultiplier(attackerTypes, defenderTypes) {
  const atk = attackerTypes || [];
  const def = defenderTypes || [];
  const hasAdv = atk.some((t) => TYPE_ADV[t]?.some((d) => def.includes(d)));
  const hasDis = def.some((t) => TYPE_ADV[t]?.some((d) => atk.includes(d)));
  if (hasAdv && !hasDis) return 1.2;
  if (!hasAdv && hasDis) return 0.8;
  return 1.0;
}

async function fetchRandomOpponent() {
  const id = Math.floor(Math.random() * 151) + 1;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return res.json();
}

export default function BattlePage() {
  const { roster } = useRoster();
  const { playerName, setPlayerName, clearPlayerName } = usePlayerName();
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [result, setResult] = useState("");
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const score = useMemo(
    () => Math.max(0, wins * 100 - losses * 25),
    [wins, losses]
  );
  const needsName = !playerName?.trim();

  const startBattle = async () => {
    setError("");
    if (needsName) {
      setError("Please set your player name first.");
      return;
    }
    if (roster.length === 0) {
      setResult("No Pokémon in roster");
      return;
    }
    const chosen = roster[Math.floor(Math.random() * roster.length)];
    setPlayer(chosen);
    const opp = await fetchRandomOpponent();
    setOpponent({
      id: opp.id,
      name: opp.name,
      sprite: opp.sprites?.front_default,
      types: opp.types?.map((t) => t.type.name) || [],
      stats: opp.stats || [],
    });

    const playerPower =
      (await getPokemonStats(chosen.name)).total *
      advantageMultiplier(
        chosen.types,
        opp.types?.map((t) => t.type.name)
      );
    const oppPower =
      (opp.stats?.reduce((sum, s) => sum + s.base_stat, 0) || 0) *
      advantageMultiplier(
        opp.types?.map((t) => t.type.name),
        chosen.types
      );

    if (playerPower > oppPower) {
      setWins((w) => w + 1);
      setResult("You win!");
    } else if (playerPower < oppPower) {
      setLosses((l) => l + 1);
      setResult("You lose!");
    } else {
      setResult("It's a tie!");
    }
  };

  async function getPokemonStats(name) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const json = await res.json();
    const total = (json.stats || []).reduce((sum, s) => sum + s.base_stat, 0);
    return { total };
  }

  const saveScore = async () => {
    if (needsName) {
      setError("Please set your player name first.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/leaderboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: playerName.trim(), score }),
      });
      if (!res.ok) throw new Error("Failed to save score");
      navigate("/board");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-extrabold mb-4">Battle</h1>

      {needsName ? (
        <PlayerNamePrompt onSave={setPlayerName} />
      ) : (
        <div className="mb-4 flex items-center gap-3">
          <span className="opacity-80">Playing as:</span>
          <span className="font-bold">{playerName}</span>
          <button
            onClick={clearPlayerName}
            className="px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-sm"
          >
            Change
          </button>
        </div>
      )}

      {roster.length === 0 ? (
        <p>Add Pokémon to your roster first.</p>
      ) : (
        <div className="space-y-4">
          <button
            onClick={startBattle}
            disabled={needsName}
            className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-bold disabled:opacity-60"
          >
            Start Battle
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="You" p={player} />
            <Card title="Opponent" p={opponent} />
          </div>

          {result && <div className="text-xl font-bold">{result}</div>}

          <div className="flex items-center gap-6 mt-2">
            <span>Wins: {wins}</span>
            <span>Losses: {losses}</span>
            <span>Score: {score}</span>
          </div>

          <div className="mt-6 bg-white/10 border border-white/20 rounded-2xl p-4 max-w-md">
            <h2 className="text-xl font-bold mb-2">Save your score</h2>
            <p className="opacity-80 mb-2">
              Player: <span className="font-bold">{playerName || "—"}</span>
            </p>
            <button
              onClick={saveScore}
              disabled={saving || needsName}
              className="px-4 py-2 rounded-xl bg-green-400 text-black font-bold disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            {error && <p className="text-red-300 mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ title, p }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl p-4 min-h-44">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      {!p ? (
        <p className="opacity-80">—</p>
      ) : (
        <div className="flex items-center gap-4">
          <img
            src={p.sprite}
            alt={p.name}
            className="w-20 h-20 object-contain"
          />
          <div>
            <div className="capitalize font-semibold">{p.name}</div>
            <div className="text-sm capitalize opacity-80">
              {(p.types || []).join(", ")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
