import { useEffect, useState } from "react";

const KEY = "playerName";

export function usePlayerName() {
  const [playerName, setPlayerNameState] = useState(() => {
    try {
      return localStorage.getItem(KEY) || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    try {
      const value = playerName?.trim();
      if (value) localStorage.setItem(KEY, value);
      else localStorage.removeItem(KEY);
    } catch {
      /* ignore storage errors */
    }
  }, [playerName]);

  const setPlayerName = (name) => setPlayerNameState(name);
  const clearPlayerName = () => setPlayerNameState("");

  return { playerName, setPlayerName, clearPlayerName };
}
