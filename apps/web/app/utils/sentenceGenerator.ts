const SUBJECTS = [
  "The cat",
  "A dog",
  "The bird",
  "A programmer",
  "The teacher",
  "A musician",
  "The chef",
  "A scientist",
  "The artist",
  "A writer",
];

const VERBS = [
  "quickly runs",
  "slowly walks",
  "carefully writes",
  "happily sings",
  "eagerly learns",
  "quietly reads",
  "boldly explores",
  "patiently waits",
  "swiftly moves",
  "gently speaks",
];

const OBJECTS = [
  "through the park",
  "across the street",
  "in the library",
  "at the beach",
  "near the mountain",
  "by the river",
  "in the garden",
  "under the stars",
  "around the city",
  "beside the lake",
];

const ENDINGS = [
  "every morning",
  "on sunny days",
  "during the weekend",
  "after midnight",
  "before dawn",
  "in the afternoon",
  "at twilight",
  "when the moon rises",
  "throughout the year",
  "once in a while",
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateRandomSentence(): string {
  const subject = getRandomItem(SUBJECTS);
  const verb = getRandomItem(VERBS);
  const object = getRandomItem(OBJECTS);
  const ending = getRandomItem(ENDINGS);
  
  return `${subject} ${verb} ${object} ${ending}`;
}
