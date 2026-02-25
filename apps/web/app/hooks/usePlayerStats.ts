import { useState, useEffect, useCallback } from "react";
import { PlayerStats, defaultPlayerStats, RaceResult } from "../types/playerStats";

const STORAGE_KEY = "typeracer_player_stats";

function loadStatsFromStorage(): PlayerStats {
  if (typeof window === "undefined") return defaultPlayerStats;
  
  const savedStats = localStorage.getItem(STORAGE_KEY);
  if (savedStats) {
    try {
      return JSON.parse(savedStats);
    } catch (error) {
      console.error("Failed to parse player stats:", error);
      return defaultPlayerStats;
    }
  }
  return defaultPlayerStats;
}

export function usePlayerStats() {
  const [stats, setStats] = useState<PlayerStats>(loadStatsFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const updateStats = useCallback((result: RaceResult) => {
    setStats((prevStats) => {
      const newTotalRaces = prevStats.totalRaces + 1;

      const totalWPM = prevStats.averageWPM * prevStats.totalRaces + result.wpm;
      const totalAccuracy = prevStats.averageAccuracy * prevStats.totalRaces + result.accuracy;

      return {
        totalRaces: newTotalRaces,
        averageWPM: Math.round(totalWPM / newTotalRaces),
        averageAccuracy: Math.round(totalAccuracy / newTotalRaces),
      };
    });
  }, []);

  const resetStats = useCallback(() => {
    setStats(defaultPlayerStats);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    stats,
    updateStats,
    resetStats,
  };
}
