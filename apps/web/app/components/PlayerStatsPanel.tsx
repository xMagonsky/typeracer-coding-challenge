import { PlayerStats } from "../types/playerStats";

interface PlayerStatsPanelProps {
  stats: PlayerStats;
}

export function PlayerStatsPanel({ stats }: PlayerStatsPanelProps) {
  return (
    <div className="max-w-4xl w-full mb-4">
      <div className="bg-[#2a2a2a] p-5 rounded-xl">
        <h2 className="text-white text-xl font-bold mb-3">Your Stats</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-[#999] text-sm">Races</div>
            <div className="text-white text-2xl font-bold">{stats.totalRaces}</div>
          </div>
          <div>
            <div className="text-[#999] text-sm">WPM</div>
            <div className="text-blue-400 text-2xl font-bold">{stats.averageWPM}</div>
          </div>
          <div>
            <div className="text-[#999] text-sm">Accuracy</div>
            <div className="text-blue-400 text-2xl font-bold">{stats.averageAccuracy}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
