import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const useWebSocket = (userId: number) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      query: { userId: userId.toString() },
    });

    newSocket.on("connect", () => {
      console.log("Successfully connected to WebSocket server");
    });

    newSocket.on("connected", (data) => {
      console.log("Backend response:", data.message);
    });

    newSocket.on("taskReminder", (data) => {
      console.log("Received reminder:", data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return socket;
};

export default useWebSocket;
