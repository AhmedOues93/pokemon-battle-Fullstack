
import { useEffect, useMemo, useState } from "react";
import { useRoster } from "../hooks/useRoster.js";
import { API_URL } from "../api/api.js";
import { useNavigate } from "react-router-dom"; 

/* --- Typen-Vorteile (einfaches Mapping) --- */
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

/* --- berechnet einen einfachen Multiplikator basierend auf Typen --- */
function advantageMultiplier(attackerTypes, defenderTypes) {
  const atk = attackerTypes || [];
  const def = defenderTypes || [];
  const hasAdv = atk.some((t) => TYPE_ADV[t]?.some((d) => def.includes(d)));
  const hasDis = def.some((t) => TYPE_ADV[t]?.some((d) => atk.includes(d)));
  if (hasAdv && !hasDis) return 1.2;
  if (!hasAdv && hasDis) return 0.8;
  return 1.0;
}

/* --- zufälligen Gegner (1..151) laden --- */
async function fetchRandomOpponent() {
  const id = Math.floor(Math.random() * 151) + 1;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return res.json();
}

export default function BattlePage() {
  const { roster } = useRoster();

  /* --- Auswahl & Kampfzustand --- */
  const [selectedName, setSelectedName] = useState("");
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);

  /* --- Ergebnis/Score --- */
  const [result, setResult] = useState("");     // "You win!" | "You lose!" | "It's a tie!"
  const [winner, setWinner] = useState("");     // "player" | "opponent" | ""
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  /* --- Spielername: muss explizit gespeichert werden, bevor man spielen kann --- */
  const [name, setName] = useState("");
  const [nameConfirmed, setNameConfirmed] = useState(false); // erst nach Klick auf "Name speichern" true
  const validName = useMemo(() => name.trim().length >= 2, [name]);

  /* --- Speichern (Leaderboard) --- */
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* --- Score-Berechnung --- */
  const score = useMemo(() => Math.max(0, wins * 100 - losses * 25), [wins, losses]);

  /* --- beim Laden automatisch ersten Pokémon aus dem Roster auswählen --- */
  useEffect(() => {
    if (!selectedName && roster.length > 0 ) setSelectedName(roster[0].name);
  }, [roster, selectedName]);

  /* --- Basiswerte eines Pokémon laden und aufsummieren --- */
  async function getPokemonStats(pokeName) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
    const json = await res.json();
    const total = (json.stats || []).reduce((sum, s) => sum + s.base_stat, 0);
    return { total };
  }

  /* --- Name explizit bestätigen (nur dann darf gespielt werden) --- */
  function confirmName() {
    if (!validName) return;
    setName((n) => n.trim());
    setNameConfirmed(true);
  }

  /* --- Name wieder ändern (falls falsch) --- */
  function changeName() {
    setNameConfirmed(false);
  }

  /* --- Kampf starten (benötigt bestätigten Namen & Auswahl) --- */
  const startBattle = async () => {
    setError("");
    setResult("");
    setWinner("");

    if (!nameConfirmed) {
      setError("Bitte speichere zuerst deinen Spielernamen.");
      return;
    }
    if (roster.length === 0) {
      setResult("No Pokémon in roster");
      return;
    }
    if (!selectedName) {
      setError("Bitte wähle ein Pokémon aus deinem Roster.");
      return;
    }

    const chosen = roster.find((p) => p.name === selectedName) || roster[0];
    setPlayer(chosen);

    const opp = await fetchRandomOpponent();
    const oppTypes = opp.types?.map((t) => t.type.name) || [];
    setOpponent({
      id: opp.id,
      name: opp.name,
      sprite: opp.sprites?.front_default,
      types: oppTypes,
      stats: opp.stats || [],
    });

    const playerPower =
      (await getPokemonStats(chosen.name)).total *
      advantageMultiplier(chosen.types, oppTypes);

    const oppPower =
      (opp.stats?.reduce((sum, s) => sum + s.base_stat, 0) || 0) *
      advantageMultiplier(oppTypes, chosen.types);

    if (playerPower > oppPower) {
      setWins((w) => w + 1);
      setResult("You win!");
      setWinner("player");
    } else if (playerPower < oppPower) {
      setLosses((l) => l + 1);
      setResult("You lose!");
      setWinner("opponent");
    } else {
      setResult("It's a tie!");
      setWinner("");
    }
  };


  const saveScore = async () => {
    if (!nameConfirmed) {
      setError("Bitte speichere zuerst deinen Spielernamen.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/leaderboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({ userName: name.trim(), score }),
      });
      if (!res.ok) throw new Error("Failed to save score");
      navigate("/board");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const selected = roster.find((p) => p.name === selectedName);

  /* --- Farbwahl für das zentrale Ergebnis --- */
  const resultColor =
    result.includes("win") ? "text-green-300" :
    result.includes("lose") ? "text-red-300" :
    result ? "text-yellow-200" : "";

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-extrabold mb-4">Battle</h1>

      {/* Spielername (muss gespeichert werden) */}
      <div className="bg-black/30 border border-white/20 rounded-2xl p-4 mb-4">
        <label className="block mb-2 font-semibold">Spielername (erforderlich)</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 rounded-xl border border-white/20 bg-black/30 px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 disabled:opacity-60"
            placeholder="Name eingeben"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={30}
            disabled={nameConfirmed}
          />
          {!nameConfirmed ? (
            <button
              onClick={confirmName}
              disabled={!validName}
              className="px-4 py-2 rounded-xl bg-green-400 text-black font-bold disabled:opacity-50"
            >
              Name speichern
            </button>
          ) : (
            <button
              onClick={changeName}
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/20"
            >
              Ändern
            </button>
          )}
        </div>
        <p className={`mt-2 text-sm ${nameConfirmed ? "text-green-300" : "text-yellow-200"}`}>
          {nameConfirmed ? "Name gespeichert – du kannst jetzt spielen." : "Bitte Namen eingeben und speichern."}
        </p>
      </div>

      {error && <p className="text-red-300 mb-4">{error}</p>}

      {roster.length === 0 ? (
        <p>Füge zuerst Pokémon zu deinem Roster hinzu.</p>
      ) : (
        <div className="space-y-5">
          {/* Auswahl des Pokémon */}
          <div className="bg-black/30 border border-white/20 rounded-2xl p-4">
            <label className="block mb-2 font-semibold">Wähle dein Pokémon</label>
            <div className="flex gap-3 items-center">
              <select
                className="px-3 py-2 rounded-xl bg-black/30 border border-white/20 text-white"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
              >
                {roster.map((p) => (
                  <option key={p.name} value={p.name} className="capitalize text-black">
                    {p.name}
                  </option>
                ))}
              </select>
              {selected && (
                <div className="flex items-center gap-3">
                  <img src={selected.sprite} alt={selected.name} className="w-12 h-12 object-contain" />
                  <div className="text-sm capitalize opacity-80">
                    {(selected.types || []).join(", ")}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Start-Button (nur aktiv nach "Name speichern") */}
          <div className="flex items-center gap-3">
            <button
              onClick={startBattle}
              disabled={!nameConfirmed}
              className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-bold disabled:opacity-50"
            >
              Start Battle
            </button>
            {!nameConfirmed && (
              <span className="text-yellow-200 text-sm">
                Zuerst Spielername speichern.
              </span>
            )}
          </div>

          {/* Kampf-Karten */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="You" p={player} isWinner={winner === "player"} />
            <Card title="Opponent" p={opponent} isWinner={winner === "opponent"} />
          </div>

          {/* Zentrales Ergebnis (groß, mittig) */}
          {result && (
            <div className={`text-center text-3xl font-extrabold ${resultColor}`}>
              {result}
            </div>
          )}

          {/* Stats/Score unter dem Ergebnis */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-2">
            <span>Wins: {wins}</span>
            <span>Losses: {losses}</span>
            <span>Score: {score}</span>
          </div>

          {/* Score speichern: zentriert in der Mitte */}
          <div className="mt-6 bg-black/30 border border-white/20 rounded-2xl p-4 max-w-md mx-auto text-center">
            <h2 className="text-xl font-bold mb-2">Score speichern</h2>
            <p className="opacity-80 mb-3">
              Spieler: <span className="font-bold">{nameConfirmed ? name : "—"}</span>
            </p>
            <button
              onClick={saveScore}
              disabled={saving || !nameConfirmed}
              className="px-4 py-2 rounded-xl bg-green-400 text-black font-bold disabled:opacity-50"
            >
              {saving ? "Speichern…" : "In Leaderboard speichern"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- Karte für Spieler/Gegner mit Sieger-Effekt --- */
function Card({ title, p, isWinner = false }) {
  return (
    <div
      className={`relative group bg-black/30 border border-white/20 rounded-2xl p-4 min-h-44 transition-all duration-500
      ${isWinner ? "ring-2 ring-green-300/60 shadow-xl scale-[1.03]" : ""}`}
    >
      {/* „WIN!“ Badge über dem Gewinner */}
      {isWinner && (
        <div className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500/20 border border-green-300/60 text-green-200 text-xl font-extrabold rounded-full px-4 py-1 shadow animate-bounce">
          WIN!
        </div>
      )}

      <h3 className="text-lg font-bold mb-2">{title}</h3>

      {!p ? (
        <p className="opacity-80">—</p>
      ) : (
        <div className="flex items-center gap-4">
          <img
            src={p.sprite}
            alt={p.name}
            className={`w-20 h-20 object-contain transition-transform duration-500
              ${isWinner ? "scale-110" : "group-hover:scale-105"}`}
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
