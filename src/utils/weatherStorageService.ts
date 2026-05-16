import { storage, StorageKeys } from "@/utils/storageService";

export function getSearchHistory(): string[] {
  return storage.get<string[]>(StorageKeys.SEARCH_HISTORY, []);
}

export function saveSearchHistory(history: string[]): void {
  storage.set(StorageKeys.SEARCH_HISTORY, history);
}

export function addToHistory(cityName: string, maxItems: number = 10): string[] {
  const history = getSearchHistory();
  const filtered = history.filter((city) => city !== cityName);
  filtered.unshift(cityName);
  const newHistory = filtered.slice(0, maxItems);
  saveSearchHistory(newHistory);
  return newHistory;
}

export function clearHistory(): void {
  storage.remove(StorageKeys.SEARCH_HISTORY);
}

export function hasHistory(): boolean {
  return getSearchHistory().length > 0;
}

export function getLastCity(): string | null {
  const history = getSearchHistory();
  return history.length > 0 ? (history[0] as string) : null;
}

export function removeFromHistory(cityName: string): void {
  const history = getSearchHistory();
  const filtered = history.filter((city) => city !== cityName);
  saveSearchHistory(filtered);
}
