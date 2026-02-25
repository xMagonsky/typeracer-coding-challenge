import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Player } from "../types/player";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:3001");

    socketInstance.on("player:self", (player: Player) => {
      setCurrentPlayer(player);
    });

    socketInstance.on("players:list", (playersList: Player[]) => {
      setPlayers(playersList);
    });

    socketRef.current = socketInstance;

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const updatePlayer = (data: Partial<Player>) => {
    if (socketRef.current) {
      socketRef.current.emit("player:update", data);
    }
  };

  return { players, currentPlayer, updatePlayer };
}
