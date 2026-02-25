"use client";

import { useState, useRef, useEffect } from "react";
import { TypedSentence } from "./TypedSentence";
import { PlayerTable } from "./PlayerTable";
import { useSocket } from "../hooks/useSocket";

interface TypeRacerProps {
  sentence: string;
  onNewSentence?: () => void;
}

export function TypeRacer({ sentence, onNewSentence }: TypeRacerProps) {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { players, currentPlayer, updatePlayer } = useSocket();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (currentPlayer) {
      const progress = Math.round((input.length / sentence.length) * 100);
      updatePlayer({ progress, wpm });
    }
  }, [input, wpm, sentence.length, currentPlayer, updatePlayer]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isComplete) return;

    const newInput = e.target.value;
    setInput(newInput);

    if (newInput.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    if (newInput === sentence && startTime) {
      setIsComplete(true);
      const timeInMinutes = (Date.now() - startTime) / 60000;
      const wordsTyped = sentence.split(" ").length;
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

  const handleNewSentence = () => {
    handleReset();
    onNewSentence?.();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-[#1a1a1a]">
      <h1 className="text-white mb-10 text-5xl">TypeRacer</h1>

      <div className="max-w-4xl w-full">
        <div className="bg-[#2a2a2a] p-10 rounded-xl mb-8">
        <TypedSentence sentence={sentence} userInput={input} />

        <input ref={inputRef} type="text" value={input} onChange={handleInput} disabled={isComplete} className="w-full p-4 text-lg font-mono border-2 border-[#444] rounded-lg bg-[#1a1a1a] text-white outline-none" placeholder="Start typing..." />

        <div className="mt-5 flex justify-between items-center">
          <div className="text-[#999] text-lg">
            {isComplete ? (
              <span className="text-green-400 font-bold">
                Complete! WPM: {wpm}
              </span>
            ) : (
              <span>
                Progress: {input.length} / {sentence.length}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={handleReset} className="px-5 py-2.5 text-base bg-green-400 text-[#1a1a1a] border-none rounded-md cursor-pointer font-bold">Reset</button>
            {onNewSentence && <button onClick={handleNewSentence} className="px-5 py-2.5 text-base bg-blue-500 text-white border-none rounded-md cursor-pointer font-bold">New Sentence</button>}
          </div>
        </div>
        </div>

        <PlayerTable players={players} />
      </div>
    </div>
  );
}
