"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { TypedSentence } from "./TypedSentence";
import { PlayerTable } from "./PlayerTable";
import { PlayerStatsPanel } from "./PlayerStatsPanel";
import { GameStatus } from "./GameStatus";
import { SentenceCountdown } from "./SentenceCountdown";
import { useSocket } from "../hooks/useSocket";
import { usePlayerStats } from "../hooks/usePlayerStats";
import { calculateWPM, calculateAccuracy, getCorrectCharacters } from "../utils/typingCalculations";

export function TypeRacer() {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputStateRef = useRef({ input: "", startTime: null as number | null, isComplete: false });

  useEffect(() => {
    inputStateRef.current = { input, startTime, isComplete };
  }, [input, startTime, isComplete]);

  const { stats, updateStats } = usePlayerStats();

  const saveRoundStats = useCallback((typedInput: string, roundStartTime: number | null, roundSentence: string, wasComplete: boolean) => {
    if (!roundStartTime || typedInput.length === 0 || wasComplete) return;

    const timeInMs = Date.now() - roundStartTime;
    const chars = getCorrectCharacters(typedInput, roundSentence);

    updateStats({
      wpm: calculateWPM(chars, timeInMs),
      accuracy: calculateAccuracy(typedInput, roundSentence),
    });
  }, [updateStats]);

  const resetGame = useCallback((previousSentence: string) => {
    const { input: currentInput, startTime: currentStartTime, isComplete: currentIsComplete } = inputStateRef.current;
    saveRoundStats(currentInput, currentStartTime, previousSentence, currentIsComplete);

    setInput("");
    setStartTime(null);
    setIsComplete(false);
    setElapsedTime(0);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [saveRoundStats]);

  const { players, currentPlayer, sentence, countdown, updatePlayer } = useSocket({
    onNewSentence: resetGame,
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!startTime || isComplete) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, isComplete]);

  const correctChars = getCorrectCharacters(input, sentence);
  const progress = sentence ? Math.round((correctChars / sentence.length) * 100) : 0;
  const currentAccuracy = calculateAccuracy(input, sentence);
  const currentWpm = startTime && input.length > 0 && elapsedTime > 0
    ? calculateWPM(correctChars, elapsedTime * 1000)
    : 0;

  useEffect(() => {
    if (currentPlayer && sentence) {
      updatePlayer({
        progress,
        avgWpm: stats.averageWPM,
        avgAccuracy: stats.averageAccuracy,
      });
    }
  }, [progress, stats.averageWPM, stats.averageAccuracy, sentence, currentPlayer, updatePlayer]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isComplete) return;

    const newInput = e.target.value;
    setInput(newInput);

    if (newInput.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    const chars = getCorrectCharacters(newInput, sentence);
    if (chars === sentence.length && startTime) {
      setIsComplete(true);
      const timeInMs = Date.now() - startTime;

      updateStats({
        wpm: calculateWPM(chars, timeInMs),
        accuracy: calculateAccuracy(newInput, sentence),
      });
    }
  };

  if (!sentence) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-[#1a1a1a]">
      <h1 className="text-white mb-10 text-5xl">TypeRacer</h1>

      <PlayerStatsPanel stats={stats} />

      <div className="max-w-4xl w-full">
        <div className="bg-[#2a2a2a] p-10 rounded-xl mb-8">
          <SentenceCountdown countdown={countdown} />

          <TypedSentence sentence={sentence} userInput={input} />

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInput}
            disabled={isComplete}
            className={`w-full p-4 text-lg font-mono border-2 rounded-lg outline-none transition-all ${
              isComplete
                ? "border-green-500 bg-[#0a0a0a] text-gray-500 cursor-not-allowed"
                : "border-[#444] bg-[#1a1a1a] text-white"
            }`}
            placeholder="Start typing..."
          />

          <GameStatus
            isComplete={isComplete}
            elapsedTime={elapsedTime}
            correctChars={correctChars}
            sentenceLength={sentence.length}
            isTyping={!!startTime}
            wpm={currentWpm}
            accuracy={currentAccuracy}
            onReset={() => {
              saveRoundStats(input, startTime, sentence, isComplete);
              setInput("");
              setStartTime(null);
              setIsComplete(false);
              setElapsedTime(0);
              inputRef.current?.focus();
            }}
          />
        </div>

        <PlayerTable players={players} />
      </div>
    </div>
  );
}
