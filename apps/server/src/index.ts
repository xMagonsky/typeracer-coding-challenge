import http from "http";
import { Server } from "socket.io";

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
