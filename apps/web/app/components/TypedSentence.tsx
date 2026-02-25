import { COLORS } from "../constants/game";

interface TypedSentenceProps {
  sentence: string;
  userInput: string;
}

export function TypedSentence({ sentence, userInput }: TypedSentenceProps) {
  return (
    <div className="bg-[#1a1a1a] p-8 rounded-lg mb-5 font-mono leading-relaxed">
      {sentence.split("").map((char, index) => {
        let color: string = COLORS.pending;
        let backgroundColor = "transparent";

        if (index < userInput.length) {
          if (userInput[index] === char) {
            color = COLORS.correct;
          } else {
            color = COLORS.incorrect;
            backgroundColor = COLORS.incorrectBg;
          }
        }

        return (
          <span key={index} className={`text-2xl ${index === userInput.length ? "font-bold underline" : "font-normal"}`} style={{ color, backgroundColor }}>
            {char}
          </span>
        );
      })}
    </div>
  );
}
