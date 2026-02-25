export const COLORS = {
  correct: "#4ade80",
  incorrect: "#ef4444",
  incorrectBg: "#fecaca",
  pending: "#666",
} as const;

export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
