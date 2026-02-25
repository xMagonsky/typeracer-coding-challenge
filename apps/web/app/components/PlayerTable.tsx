import { Player } from "../types/player";

interface PlayerTableProps {
  players: Player[];
}

export function PlayerTable({ players }: PlayerTableProps) {
  return (
    <div className="bg-[#2a2a2a] rounded-xl p-5 mb-8">
      <h2 className="text-white mb-4 text-2xl">Live Players</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-[#444]">
            <th className="text-[#999] p-3 text-left text-sm font-semibold">Player</th>
            <th className="text-[#999] p-3 text-left text-sm font-semibold">Progress</th>
            <th className="text-[#999] p-3 text-left text-sm font-semibold">Avg WPM</th>
            <th className="text-[#999] p-3 text-left text-sm font-semibold">Avg Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id} className="border-b border-[#333]">
              <td className="text-white p-3 text-base">{player.name}</td>
              <td className="p-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex-1 h-2 bg-[#1a1a1a] rounded overflow-hidden">
                    <div className="h-full bg-green-400 transition-all duration-300 ease-in-out" style={{ width: `${player.progress}%` }} />
                  </div>
                  <span className="text-[#999] text-sm min-w-[45px]">{player.progress}%</span>
                </div>
              </td>
              <td className="text-blue-400 p-3 text-base">{player.avgWpm}</td>
              <td className="text-blue-400 p-3 text-base">{player.avgAccuracy}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
