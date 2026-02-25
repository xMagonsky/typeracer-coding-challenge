import { COLORS } from "../constants/game";

interface TypedPhraseProps {
  phrase: string;
  userInput: string;
}

export function TypedPhrase({ phrase, userInput }: TypedPhraseProps) {
  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        padding: "30px",
        borderRadius: "8px",
        marginBottom: "20px",
        fontFamily: "monospace",
        lineHeight: "1.8",
      }}
    >
      {phrase.split("").map((char, index) => {
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
          <span
            key={index}
            style={{
              color,
              backgroundColor,
              fontSize: "24px",
              fontWeight: index === userInput.length ? "bold" : "normal",
              textDecoration:
                index === userInput.length ? "underline" : "none",
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
