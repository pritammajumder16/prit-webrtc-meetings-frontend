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
  setIsVideoOff: React.Dispatch<React.SetStateAction<boolean>>;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  isVolume: boolean;
  setIsVolume: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMute: () => void;
  toggleVideo: () => void;
}
