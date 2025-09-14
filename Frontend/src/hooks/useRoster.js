import { useEffect, useState } from "react";

const STORAGE_KEY = "roster";

export function useRoster() {
  const [roster, setRoster] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roster));
  }, [roster]);

  const add = (pokemon) => {
    setRoster((prev) => {
      if (prev.some((p) => p.name === pokemon.name)) return prev; // no dupes
      return [...prev, pokemon];
    });
  };

  const removeByName = (name) =>
    setRoster((prev) => prev.filter((p) => p.name !== name));
  const clear = () => setRoster([]);

  return { roster, add, removeByName, clear };
}
