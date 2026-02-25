"use client";

import { useState, useRef, useEffect } from "react";
import { TypedPhrase } from "./TypedPhrase";
import { PlayerTable } from "./PlayerTable";

const MOCK_PLAYERS = [
  { id: "1", name: "user1", progress: 75, wpm: 82, accuracy: 97 },
  { id: "2", name: "user2", progress: 55, wpm: 68, accuracy: 94 },
  { id: "3", name: "user3", progress: 42, wpm: 71, accuracy: 91 },
];

interface TypeRacerProps {
  phrase: string;
}

export function TypeRacer({ phrase }: TypeRacerProps) {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isComplete) return;

    const newInput = e.target.value;
    setInput(newInput);

    if (newInput.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    if (newInput === phrase && startTime) {
      setIsComplete(true);
      const timeInMinutes = (Date.now() - startTime) / 60000;
      const wordsTyped = phrase.split(" ").length;
      setWpm(Math.round(wordsTyped / timeInMinutes));
    }
  };

  const handleReset = () => {
    setInput("");
    setStartTime(null);
    setWpm(0);
    setIsComplete(false);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-[#1a1a1a]">
      <h1 className="text-white mb-10 text-5xl">TypeRacer</h1>

      <div className="max-w-4xl w-full">
        <div className="bg-[#2a2a2a] p-10 rounded-xl mb-8">
        <TypedPhrase phrase={phrase} userInput={input} />

        <input ref={inputRef} type="text" value={input} onChange={handleInput} disabled={isComplete} className="w-full p-4 text-lg font-mono border-2 border-[#444] rounded-lg bg-[#1a1a1a] text-white outline-none" placeholder="Start typing..." />

        <div className="mt-5 flex justify-between items-center">
          <div className="text-[#999] text-lg">
            {isComplete ? (
              <span className="text-green-400 font-bold">
                Complete! WPM: {wpm}
              </span>
            ) : (
              <span>
                Progress: {input.length} / {phrase.length}
              </span>
            )}
          </div>

          <button onClick={handleReset} className="px-5 py-2.5 text-base bg-green-400 text-[#1a1a1a] border-none rounded-md cursor-pointer font-bold">
            Reset
          </button>
        </div>
        </div>

        <PlayerTable players={MOCK_PLAYERS} />
      </div>
    </div>
  );
}
