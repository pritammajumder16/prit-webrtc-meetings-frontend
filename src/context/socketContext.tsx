/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState, useRef, useEffect, ReactNode } from "react";
import Peer from "simple-peer";
import { SocketContextType } from "../types/interface";
import { generateUniqueId } from "../utils/generateUniqueId";
import { generateGuestName } from "../utils/generateGuestName";
import { credentials } from "../constants";

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
  const connectionRef = useRef<Peer.Instance>();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [call, setCall] = useState<any>();
  const [myUserId, setMyUserId] = useState<string>("");
  const [name, setName] = useState<string>(generateGuestName());
  const socket = useRef<WebSocket | null>(null); // Use useRef to store the WebSocket instance
  const uniqueId = useRef(generateUniqueId()).current; // Use a ref to keep the uniqueId constant
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVolume, setIsVolume] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const localPeer = useRef<Peer.Instance>();
  const [isShareScreen, setIsShareScreen] = useState<boolean>(false);
  const recipentPeer = useRef<Peer.Instance>();
  const [roomId, setRoomId] = useState<string>("");
  useEffect(() => {
    socket.current = new WebSocket(
      `${credentials.socketBaseUrl}?userId=${uniqueId}`
    );

    const socketInstance = socket.current;
    setMyUserId(uniqueId);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        console.log("Media stream obtained:", currentStream);
        setStream(currentStream);
        if (localVideo.current) {
          localVideo.current.srcObject = currentStream;
        }
      })
      .catch((error) => {
        console.error("Error getting media stream:", error);
      });

    socketInstance.onopen = () => {
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
          case "joinRoomCallback":
            setRoomId(data.roomId);
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

  //incoming_call - Recieving call
  const handleIncomingCall = (data: any) => {
    setCall({
      isReceivedCall: true,
      callerId: data.callerId,
      signalData: data.signalData,
      callerName: data.callerName,
    });
  };

  const handleCallAccepted = (data: any) => {
    socket?.current?.send(
      JSON.stringify({ eventType: "join_room", roomId: data.callerId })
    );
    console.log("call accepted", data);
    setCallAccepted(true);
    setCall({
      isReceivedCall: false,
      callerId: data.callerId,
      signalData: data.signalData,
      callerName: data.callerName,
    });
    connectionRef.current?.signal(data.signalData);
  };

  const answerCall = () => {
    console.log(" Non initiator: Answering the call... ", call);
    socket?.current?.send(
      JSON.stringify({ eventType: "join_room", roomId: myUserId })
    );
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    });
    recipentPeer.current = peer;

    peer.signal(call.signalData);
    peer.on("signal", (signal) => {
      setCallAccepted(true);
      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.send(
          JSON.stringify({
            eventType: "answer_call",
            signalData: signal,
            callerId: call.callerId,
            myUserId: myUserId,
            myName: name,
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
        remoteVideo.current
      );
      if (remoteVideo.current) {
        console.log("playing");
        remoteVideo.current.srcObject = currentStream;
        remoteVideo.current.play().catch((error) => {
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

  //call
  const callUser = (id: string) => {
    console.log("Calling user:", id);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    });
    localPeer.current = peer;
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
      console.log("Received remote stream -- initiator user");
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
  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await (
        navigator.mediaDevices as any
      ).getDisplayMedia({
        video: true,
      });
      const screenTrack = screenStream.getVideoTracks()[0];

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

  const stopScreenShare = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      localPeer?.current?.replaceTrack(
        localPeer?.current?.streams[0].getVideoTracks()[0],
        videoTrack,
        localPeer?.current?.streams[0]
      );
      setIsShareScreen(false);
    }
  };
  const toggleScreenShare = () => {
    console.log(isShareScreen);
    if (isShareScreen) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
