import { useState, useCallback } from "react";
import * as weatherStorage from "@/utils/weatherStorageService";

interface UseSearchHistoryReturn {
  history: string[];
  addCity: (cityName: string) => void;
  removeCity: (cityName: string) => void;
  clearHistory: () => void;
  lastCity: string | null;
}

export function useSearchHistory(): UseSearchHistoryReturn {
  const [history, setHistory] = useState<string[]>(() => {
    return weatherStorage.getSearchHistory();
  });

  const addCity = useCallback((cityName: string) => {
    if (!cityName || !cityName.trim()) return;
    const updated = weatherStorage.addToHistory(cityName.trim());
    setHistory(updated);
  }, []);

  const removeCity = useCallback((cityName: string) => {
    weatherStorage.removeFromHistory(cityName);
    const updated = weatherStorage.getSearchHistory();
    setHistory(updated);
  }, []);

  const clearHistory = useCallback(() => {
    weatherStorage.clearHistory();
    setHistory([]);
  }, []);

  const lastCity = history.length > 0 ? (history[0] as string) : null;

  return { history, addCity, removeCity, clearHistory, lastCity };
}
