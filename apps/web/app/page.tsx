"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { generateRandomSentence } from "./utils/sentenceGenerator";

const TypeRacer = dynamic(() => import("./components/TypeRacer").then(mod => ({ default: mod.TypeRacer })), {
  ssr: false,
});

export default function Home() {
  const [sentence, setSentence] = useState(() => generateRandomSentence());
  const [key, setKey] = useState(0);
  
  const handleNewSentence = () => {
    setSentence(generateRandomSentence());
    setKey(prev => prev + 1);
  };
  
  return <TypeRacer key={key} sentence={sentence} onNewSentence={handleNewSentence} />;
}
