export function calculateWPM(characters: number, timeInMs: number): number {
  if (timeInMs <= 0) return 0;
  
  const minutes = timeInMs / 60000;
  const words = characters / 5; // Standard: 5 characters = 1 word
  
  return Math.round(words / minutes);
}

export function calculateAccuracy(userInput: string, targetText: string): number {
  if (userInput.length === 0) return 100;

  let correctChars = 0;
  const maxLength = Math.min(userInput.length, targetText.length);

  for (let i = 0; i < maxLength; i++) {
    if (userInput[i] === targetText[i]) {
      correctChars++;
    }
  }

  const accuracy = (correctChars / targetText.length) * 100;

  return Math.round(Math.max(0, Math.min(100, accuracy)));
}

export function getCorrectCharacters(userInput: string, targetText: string): number {
  let correctChars = 0;
  
  for (let i = 0; i < userInput.length && i < targetText.length; i++) {
    if (userInput[i] === targetText[i]) {
      correctChars++;
    } else {
      break;
    }
  }
  
  return correctChars;
}
