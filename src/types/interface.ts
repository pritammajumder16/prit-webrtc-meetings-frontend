export interface ContextType {
  stream?: MediaStream;
  myVideo: React.RefObject<HTMLVideoElement>;
  answerCall: () => void;
  callUser: (id: string) => void;
  leaveCall: () => void;
  callAccepted: boolean;
  userVideo: React.RefObject<HTMLVideoElement>;
  callEnded: boolean;
}
