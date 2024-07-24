/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState, useRef, useEffect, ReactNode } from "react";
import Peer from "simple-peer";
import { ICall, Message, SocketContextType } from "../types/interface";
import { generateUniqueId } from "../utils/generateUniqueId";
import { generateGuestName } from "../utils/generateGuestName";
import { credentials } from "../constants";
import iceServers from "../constants/iceServers";

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [stream, setStream] = useState<MediaStream>();
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(true);
  const [call, setCall] = useState<ICall>();
  const [myUserId, setMyUserId] = useState<string>("");
  const [name, setName] = useState<string>(generateGuestName());
  const socket = useRef<WebSocket | null>(null); // Use useRef to store the WebSocket instance
  const uniqueId = useRef(generateUniqueId()).current; // Use a ref to keep the uniqueId constant
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVolume, setIsVolume] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const localPeer = useRef<Peer.Instance>();
  const [isShareScreen, setIsShareScreen] = useState<boolean>(false);
  const remotePeer = useRef<Peer.Instance>();
  const [roomId, setRoomId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const getNavigatorMediaStream = ({
    audio,
    video,
  }: {
    audio: boolean;
    video: boolean;
  }) => {
    if (audio || video) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30, max: 60 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })
        .then((currentStream) => {
          setStream(currentStream);
          if (localVideo.current) {
            localVideo.current.srcObject = currentStream;
          }
        })
        .catch((error) => {
          console.error("Error getting media stream:", error);
        });
    }
  };

  useEffect(() => {
    socket.current = new WebSocket(
      `${credentials.socketBaseUrl}?userId=${uniqueId}`
    );
    getNavigatorMediaStream({ audio: !isMuted, video: !isVideoOff });
    const socketInstance = socket.current;
    setMyUserId(uniqueId);

    socketInstance.onopen = () => {
      socketInstance.onmessage = (message) => {
        const data = JSON.parse(message.data);
        switch (data.eventType) {
          case "connectionCallback":
            break;
          case "incoming_call":
            handleIncomingCall(data);
            break;
          case "call_answer":
            handleCallAccepted(data);
            break;
          case "joinRoomCallback":
            setRoomId(data.data.roomId);
            break;
          case "incoming_message":
            setMessages((s) => [
              { message: data.message, from: data.from, time: data.time },
              ...s,
            ]);
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

  // callUser
  const callUser = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:your.turn.server:3478",
            username: "username",
            credential: "password",
          },
        ],
      },
    });
    peer.on("signal", (signal) => {
      socket?.current?.send(
        JSON.stringify({
          eventType: "call",
          targetId: id,
          callerId: myUserId,
          signalData: signal,
          callerName: name,
        })
      );
    });

    peer.on("stream", (currentStream) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = currentStream;
        remoteVideo.current.play().catch((error) => {
          console.error("Error playing video stream:", error);
        });
      }
    });

    peer.on("error", (error) => {
      console.error("Peer error:", error);
    });

    localPeer.current = peer;
  };

  // handleIncomingCall
  const handleIncomingCall = (data: any) => {
    setCall({
      isReceivedCall: true,
      callerId: data.callerId,
      signalData: data.signalData,
      callerName: data.callerName,
    });
  };

  // answerCall
  const answerCall = () => {
    setCallAccepted(true);
    socket?.current?.send(
      JSON.stringify({ eventType: "join_room", roomId: myUserId })
    );
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      config: {
        iceServers,
      },
    });

    peer.signal(call?.signalData);
    peer.on("signal", (signal) => {
      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.send(
          JSON.stringify({
            eventType: "answer_call",
            signalData: signal,
            callerId: call?.callerId,
            myUserId: myUserId,
            myName: name,
          })
        );
      } else {
        console.error("WebSocket is not open");
      }
    });

    peer.on("stream", (currentStream) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = currentStream;
        remoteVideo.current.play().catch((error) => {
          console.error("Error playing video stream:", error);
        });
      }
    });

    peer.on("error", (error) => {
      console.error("Peer error:", error);
    });

    peer.on("close", () => {
      console.log("Peer connection closed");
    });

    remotePeer.current = peer;
  };

  // handleCallAccepted
  const handleCallAccepted = (data: any) => {
    socket?.current?.send(
      JSON.stringify({ eventType: "join_room", roomId: data.callerId })
    );
    setCallAccepted(true);
    setCall({
      isReceivedCall: false,
      callerId: data.callerId,
      signalData: data.signalData,
      callerName: data.callerName,
    });
    localPeer.current?.signal(data.signalData);
  };

  // leaveCall
  const leaveCall = () => {
    setCallEnded(true);
    localPeer.current?.destroy();
    setIsShareScreen(false);
    remotePeer.current?.destroy();
    setCall(undefined);
    setCallAccepted(false);
    localPeer.current = undefined;
    remotePeer.current = undefined;
    setIsMuted(false);
    setIsVideoOff(false);
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ eventType: "end_call" }));
    } else {
      console.error("WebSocket is not open");
    }
  };

  // toggleMute
  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // toggleVideo
  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  // startScreenShare
  const startScreenShare = async () => {
    try {
      const screenStream = await (
        navigator.mediaDevices as any
      ).getDisplayMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, max: 60 },
        },
      });
      const screenTrack = screenStream.getVideoTracks()[0];

      if (localVideo.current) localVideo.current.srcObject = screenStream;
      localPeer?.current?.replaceTrack(
        localPeer?.current?.streams[0].getVideoTracks()[0],
        screenTrack,
        localPeer?.current?.streams[0]
      );
      setIsShareScreen(true);

      screenTrack.onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      console.error("Error starting screen share:", error);
    }
  };

  // stopScreenShare
  const stopScreenShare = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (localVideo.current) localVideo.current.srcObject = stream;
      localPeer?.current?.replaceTrack(
        localPeer?.current?.streams[0].getVideoTracks()[0],
        videoTrack,
        localPeer?.current?.streams[0]
      );
      setIsShareScreen(false);
    }
  };

  // toggleScreenShare
  const toggleScreenShare = () => {
    if (isShareScreen) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  // sendMessage
  const sendMessage = (message: string) => {
    if (roomId)
      socket?.current?.send(
        JSON.stringify({
          eventType: "send_message",
          roomId: roomId,
          message,
          time: new Date(),
          from: name,
        })
      );
  };

  return (
    <SocketContext.Provider
      value={{
        stream,
        localVideo,
        remoteVideo,
        answerCall,
        callUser,
        leaveCall,
        callAccepted,
        callEnded,
        call,
        name,
        sendMessage,
        messages,
        setName,
        myUserId,
        isVideoOff,
        roomId,
        isMuted,
        isVolume,
        setIsVolume,
        toggleVideo,
        toggleMute,
        toggleScreenShare,
        isShareScreen,
        remotePeer,
        localPeer,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
