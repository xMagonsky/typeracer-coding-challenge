"use client";

import { useState, useRef, useEffect } from "react";
import { TypedPhrase } from "./TypedPhrase";
import { COLORS } from "../constants/game";

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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#1a1a1a",
      }}
    >
      <h1 style={{ color: "#fff", marginBottom: "40px", fontSize: "48px" }}>
        TypeRacer
      </h1>

      <div
        style={{
          backgroundColor: "#2a2a2a",
          padding: "40px",
          borderRadius: "12px",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <TypedPhrase phrase={phrase} userInput={input} />

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          disabled={isComplete}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "18px",
            fontFamily: "monospace",
            border: "2px solid #444",
            borderRadius: "8px",
            backgroundColor: "#1a1a1a",
            color: "#fff",
            outline: "none",
          }}
          placeholder="Start typing..."
        />

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ color: "#999", fontSize: "18px" }}>
            {isComplete ? (
              <span style={{ color: COLORS.correct, fontWeight: "bold" }}>
                Complete! WPM: {wpm}
              </span>
            ) : (
              <span>
                Progress: {input.length} / {phrase.length}
              </span>
            )}
          </div>

          <button
            onClick={handleReset}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: COLORS.correct,
              color: "#1a1a1a",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
