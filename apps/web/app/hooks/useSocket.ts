import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Player } from "../types/player";
import { SOCKET_URL } from "../constants/game";

interface UseSocketOptions {
  onNewSentence?: () => void;
}

export function useSocket({ onNewSentence }: UseSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [sentence, setSentence] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const onNewSentenceRef = useRef(onNewSentence);
  const isFirstSentenceRef = useRef(true);

  onNewSentenceRef.current = onNewSentence;

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);

    socketInstance.on("player:self", (player: Player) => {
      setCurrentPlayer(player);
    });

    socketInstance.on("players:list", (playersList: Player[]) => {
      setPlayers(playersList);
    });

    socketInstance.on("sentence:current", (currentSentence: string) => {
      setSentence(currentSentence);

      if (isFirstSentenceRef.current) {
        isFirstSentenceRef.current = false;
      } else {
        onNewSentenceRef.current?.();
      }
    });

    socketInstance.on("timer:countdown", (timeRemaining: number) => {
      setCountdown(timeRemaining);
    });

    socketRef.current = socketInstance;

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const updatePlayer = useCallback((data: Partial<Player>) => {
    if (socketRef.current) {
      socketRef.current.emit("player:update", data);
    }
  }, []);

  return { players, currentPlayer, sentence, countdown, updatePlayer };
}
