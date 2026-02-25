interface SentenceCountdownProps {
  countdown: number;
  totalDuration?: number;
}

export function SentenceCountdown({ countdown, totalDuration = 30 }: SentenceCountdownProps) {
  const percentage = (countdown / totalDuration) * 100;
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-yellow-400 text-sm font-semibold">Next sentence in:</span>
        <span className="text-yellow-400 text-sm font-bold">{countdown}s</span>
      </div>
      <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-yellow-400 to-orange-400 transition-all duration-1000 ease-linear"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
