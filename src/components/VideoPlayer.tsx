/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { SocketContext } from "../context/socketContext";
import { SocketContextType } from "../types/interface";

const VideoPlayer = () => {
  const socketContext = useContext<SocketContextType | undefined>(
    SocketContext
  );
  return (
    <div className="mt-10 text-black dark:text-white gap-5 flex flex-wrap items-center justify-center">
      {socketContext?.stream && (
        <div className="flex flex-col items-center gap-2 ">
          <span className="font-semibold text-xl">You</span>
          <video
            className="h-96"
            playsInline
            muted
            autoPlay
            ref={socketContext?.localVideo}
          />
        </div>
      )}
      {socketContext?.call && (
        <div className="flex flex-col items-center gap-2 ">
          <span className="font-semibold text-xl">
            {socketContext.call?.callerName}
          </span>
          <video playsInline autoPlay ref={socketContext?.remoteVideo} />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
