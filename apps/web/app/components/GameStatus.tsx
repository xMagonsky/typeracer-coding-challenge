interface GameStatusProps {
  isComplete: boolean;
  elapsedTime: number;
  inputLength: number;
  sentenceLength: number;
  isTyping: boolean;
  wpm: number;
  accuracy: number;
  onReset: () => void;
}

export function GameStatus({
  isComplete,
  elapsedTime,
  inputLength,
  sentenceLength,
  isTyping,
  wpm,
  accuracy,
  onReset,
}: GameStatusProps) {
  return (
    <div className="mt-5 flex justify-between items-center">
      <div className="text-[#999] text-lg">
        {isComplete ? (
          <span className="text-green-400 font-bold">
            Complete! WPM: {wpm} | Accuracy: {accuracy}% | Time: {elapsedTime}s
          </span>
        ) : (
          <span>
            Progress: {inputLength} / {sentenceLength}
            {isTyping && (
              <>
                <span className="ml-4 text-blue-400">Time: {elapsedTime}s</span>
                <span className="ml-4 text-purple-400">WPM: {wpm}</span>
                <span className="ml-4 text-orange-400">Accuracy: {accuracy}%</span>
              </>
            )}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="px-5 py-2.5 text-base bg-green-400 text-[#1a1a1a] border-none rounded-md cursor-pointer font-bold"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
