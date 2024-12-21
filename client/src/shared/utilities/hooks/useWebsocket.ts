import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const useWebSocket = (userId: number) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Pass userId directly in the query parameters during connection
    const newSocket = io("http://localhost:3000", {
      query: { userId: userId.toString() }, // Pass userId in query
    });

    // Log when the socket is successfully connected
    newSocket.on("connect", () => {
      console.log("Successfully connected to WebSocket server");
    });

    // Log the message from the backend when connected
    newSocket.on("connected", (data) => {
      console.log("Backend response:", data.message);
    });

    // Listen for task reminder messages
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
