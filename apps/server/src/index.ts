import http from "http";
import { Server } from "socket.io";
import { generateRandomSentence } from "./sentenceGenerator";

interface Player {
  id: string;
  name: string;
  progress: number;
  wpm: number;
  accuracy: number;
}

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const players = new Map<string, Player>();
let currentSentence = generateRandomSentence();

const SENTENCE_DURATION = 30 * 1000;
let nextSentenceTime = Date.now() + SENTENCE_DURATION;

function generateNewSentence() {
  currentSentence = generateRandomSentence();
  nextSentenceTime = Date.now() + SENTENCE_DURATION;
  
  players.forEach(player => {
    player.progress = 0;
    player.wpm = 0;
  });
  
  io.emit("sentence:current", currentSentence);
  io.emit("players:list", Array.from(players.values()));
}

setInterval(generateNewSentence, SENTENCE_DURATION);

// Broadcast countdown every second
setInterval(() => {
  const timeRemaining = Math.max(0, Math.ceil((nextSentenceTime - Date.now()) / 1000));
  io.emit("timer:countdown", timeRemaining);
}, 1000);

function generateNickname() {
  return `Player${Math.floor(Math.random() * 100)}`;
}

io.on("connection", (socket) => {
  const player: Player = {
    id: socket.id,
    name: generateNickname(),
    progress: 0,
    wpm: 0,
    accuracy: 100,
  };

  players.set(socket.id, player);
  
  socket.emit("player:self", player);
  socket.emit("sentence:current", currentSentence);
  socket.emit("timer:countdown", Math.max(0, Math.ceil((nextSentenceTime - Date.now()) / 1000)));
  
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

const port = Number(process.env.PORT) || 3001;

httpServer.listen(port, () => {
  console.log(`Socket server listening on ${port}`);
});
