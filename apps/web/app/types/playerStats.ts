export interface PlayerStats {
  totalRaces: number;
  averageWPM: number;
  averageAccuracy: number;
}

export interface RaceResult {
  wpm: number;
  accuracy: number;
}

export const defaultPlayerStats: PlayerStats = {
  totalRaces: 0,
  averageWPM: 0,
  averageAccuracy: 0,
};
