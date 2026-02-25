import http from "http";
import { Server } from "socket.io";
import { generateRandomSentence } from "./sentenceGenerator";


interface Player {
  id: string;
  name: string;
  progress: number;
  avgWpm: number;
  avgAccuracy: number;
}

const PORT = Number(process.env.PORT) || 3001;
const SENTENCE_DURATION_MS = 30 * 1000;
const COUNTDOWN_INTERVAL_MS = 1000;

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const players = new Map<string, Player>();
let currentSentence = generateRandomSentence();
let nextSentenceTime = Date.now() + SENTENCE_DURATION_MS;

function getTimeRemaining(): number {
  return Math.max(0, Math.ceil((nextSentenceTime - Date.now()) / 1000));
}

function generateNewSentence() {
  currentSentence = generateRandomSentence();
  nextSentenceTime = Date.now() + SENTENCE_DURATION_MS;
  
  players.forEach(player => {
    player.progress = 0;
  });
  
  io.emit("sentence:current", currentSentence);
  io.emit("players:list", Array.from(players.values()));
}

setInterval(generateNewSentence, SENTENCE_DURATION_MS);

setInterval(() => {
  io.emit("timer:countdown", getTimeRemaining());
}, COUNTDOWN_INTERVAL_MS);

function generateNickname() {
  return `Player${Math.floor(Math.random() * 100)}`;
}

io.on("connection", (socket) => {
  const player: Player = {
    id: socket.id,
    name: generateNickname(),
    progress: 0,
    avgWpm: 0,
    avgAccuracy: 0,
  };

  players.set(socket.id, player);
  
  socket.emit("player:self", player);
  socket.emit("sentence:current", currentSentence);
  socket.emit("timer:countdown", getTimeRemaining());
  
  io.emit("players:list", Array.from(players.values()));

  socket.on("disconnect", () => {
    players.delete(socket.id);
    io.emit("players:list", Array.from(players.values()));
  });

  socket.on("player:update", (data: Partial<Player>) => {
    const player = players.get(socket.id);
    if (player) {
      Object.assign(player, data);
      io.emit("players:list", Array.from(players.values()));
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket server listening on ${PORT}`);
});
