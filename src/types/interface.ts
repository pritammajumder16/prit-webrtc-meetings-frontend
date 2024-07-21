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
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  isShareScreen: boolean;
}
