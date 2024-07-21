/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SocketContextType {
  stream?: MediaStream;
  myVideo: React.RefObject<HTMLVideoElement>;
  answerCall: () => void;
  callUser: (id: string) => void;
  leaveCall: () => void;
  callAccepted: boolean;
  userVideo: React.RefObject<HTMLVideoElement>;
  callEnded: boolean;
  call: any;
  myUserId: string;
}
