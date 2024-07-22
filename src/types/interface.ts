/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SocketContextType {
  stream?: MediaStream;
  localVideo: React.RefObject<HTMLVideoElement>;
  answerCall: () => void;
  callUser: (id: string) => void;
  leaveCall: () => void;
  callAccepted: boolean;
  remoteVideo: React.RefObject<HTMLVideoElement>;
  callEnded: boolean;
  call: any;
  setName: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  myUserId: string;
  isVideoOff: boolean;
  isMuted: boolean;
  isVolume: boolean;
  setIsVolume: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMute: () => void;
  roomId: string;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  isShareScreen: boolean;
  messages: Message[];
  sendMessage: (message: string) => void;
}
export interface Message {
  message: string;
  from: string;
  time: string;
}
