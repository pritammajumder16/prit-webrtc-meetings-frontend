/* eslint-disable @typescript-eslint/no-explicit-any */
import Peer from "simple-peer";
export interface SocketContextType {
  stream?: MediaStream;
  localVideo: React.RefObject<HTMLVideoElement>;
  answerCall: () => void;
  callUser: (id: string) => void;
  leaveCall: () => void;
  callAccepted: boolean;
  remoteVideo: React.RefObject<HTMLVideoElement>;
  callEnded: boolean;
  call: ICall | undefined;
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
  remotePeer: React.MutableRefObject<Peer.Instance | undefined>;
  localPeer: React.MutableRefObject<Peer.Instance | undefined>;
}
export interface Message {
  message: string;
  from: string;
  time: string;
}
export interface ICall {
  isReceivedCall: boolean;
  callerId: string;
  signalData: any;
  callerName: string;
}
