/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useState, useRef, useEffect, ReactNode } from "react";
import Peer from "simple-peer";
import { SocketContextType } from "../types/interface";
import { generateUniqueId } from "../utils/generateUniqueId";

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [stream, setStream] = useState<MediaStream>();
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance>();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [call, setCall] = useState<any>();
  const [myUserId, setMyUserId] = useState<string>("");

  const socket = useRef<WebSocket | null>(null); // Use useRef to store the WebSocket instance
  const uniqueId = useRef(generateUniqueId()).current; // Use a ref to keep the uniqueId constant

  useEffect(() => {
    socket.current = new WebSocket(`ws://localhost:8080?userId=${uniqueId}`);

    const socketInstance = socket.current;
    setMyUserId(uniqueId);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    socketInstance.onopen = () => {
      console.log("WebSocket connected");
      socketInstance.onmessage = (message) => {
        const data = JSON.parse(message.data);
        console.log("Message received:", data);
        switch (data.eventType) {
          case "connectionCallback":
            break;
          case "incoming_call":
            handleIncomingCall(data);
            break;
          case "call_answer":
            handleCallAccepted(data);
            break;
          default:
            break;
        }
      };
      socketInstance.onclose = () => {
        console.log("WebSocket connection closed");
      };

      socketInstance.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    return () => {
      console.log("Cleaning up WebSocket");
      if (socketInstance) {
        socketInstance.close();
      }
    };
  }, [uniqueId]);

  const handleIncomingCall = (data: any) => {
    setCall({
      isReceivedCall: true,
      callerId: data.callerId,
      signalData: data.signalData,
    });
  };

  const handleCallAccepted = (data: any) => {
    setCallAccepted(true);
    connectionRef.current?.signal(data.signalData);
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (signal) => {
      socket.current?.send(
        JSON.stringify({
          eventType: "call_answer",
          signalData: signal,
        })
      );
    });
    peer.on("stream", (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });
    connectionRef.current = peer;
  };

  const callUser = (id: string) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (signal) => {
      socket.current?.send(
        JSON.stringify({
          eventType: "call",
          targetId: id,
          signalData: signal,
        })
      );
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current?.destroy();
    socket.current?.send(JSON.stringify({ eventType: "end_call" }));
  };

  return (
    <SocketContext.Provider
      value={{
        stream,
        myVideo,
        userVideo,
        answerCall,
        callUser,
        leaveCall,
        callAccepted,
        callEnded,
        call,
        myUserId,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
