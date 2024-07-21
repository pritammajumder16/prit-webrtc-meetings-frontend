/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useState, useRef, useEffect, ReactNode } from "react";
import Peer from "simple-peer";
import { ContextType } from "../types/interface";

const SocketContext = createContext<ContextType | undefined>(undefined);

const socket = new WebSocket("ws://localhost:8080");

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

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      switch (data.eventType) {
        case "connectionCallback":
          setMyUserId(data.data);
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

    return () => {
      socket.close();
    };
  }, []);

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
      socket.send(
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
      socket.send(
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
    socket.send(JSON.stringify({ eventType: "end_call" }));
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
