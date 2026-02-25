"use client";

import { io } from "socket.io-client";
import { useEffect, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      setMessages((m) => [...m, "connected"]);
    });

    socket.on("message", (msg: string) => {
      setMessages((m) => [...m, msg]);
    });

    // Send test message
    socket.send("test");

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>WebSocket Test</h1>
      <pre>{messages.join("\n")}</pre>
    </div>
  );
}
