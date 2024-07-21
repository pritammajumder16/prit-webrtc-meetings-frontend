/* eslint-disable @typescript-eslint/no-explicit-any */
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
        console.log("Media stream obtained:", currentStream);
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((error) => {
        console.error("Error getting media stream:", error);
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
    console.log("incoming call:", data);
    setCall({
      isReceivedCall: true,
      callerId: data.callerId,
      signalData: data.signalData,
    });
  };

  const handleCallAccepted = (data: any) => {
    console.log("Call accepted with signal data:", data.signalData);
    setCallAccepted(true);
    connectionRef.current?.signal(data.signalData);
  };

  const answerCall = () => {
    console.log(" Non initiator: Answering the call... ", call);

    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.signal(call.signalData);
    peer.on("signal", (signal) => {
      setCallAccepted(true);
      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.send(
          JSON.stringify({
            eventType: "answer_call",
            signalData: signal,
            callerId: call.callerId,
          })
        );
      } else {
        console.error("WebSocket is not open");
      }
    });

    peer.on("stream", (currentStream) => {
      console.log(
        "Received remote stream -- Non initiator",
        currentStream,
        userVideo.current
      );
      if (userVideo.current) {
        console.log("playing");
        userVideo.current.srcObject = currentStream;
        userVideo.current.play().catch((error) => {
          console.error("Error playing video stream:", error);
        });
      }
    });

    peer.on("error", (error) => {
      console.error("Peer error:", error);
    });

    peer.on("connect", () => {
      console.log("Peer connection established");
    });

    peer.on("close", () => {
      console.log("Peer connection closed");
    });

    connectionRef.current = peer;
  };

  const callUser = (id: string) => {
    console.log("Calling user:", id);

    if (!stream) {
      console.error("No media stream available.");
      return;
    }

    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket?.current?.send(
        JSON.stringify({
          eventType: "call",
          targetId: id,
          callerId: myUserId,
          signalData: signal,
        })
      );
    });

    peer.on("stream", (currentStream) => {
      console.log("Received remote stream -- initiator user");
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.on("error", (error) => {
      console.error("Peer error:", error);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current?.destroy();
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ eventType: "end_call" }));
    } else {
      console.error("WebSocket is not open");
    }
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
