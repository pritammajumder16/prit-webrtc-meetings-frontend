/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { SocketContextType } from "../types/interface";
import InititalControls from "./InititalControls";

const VideoPlayer = () => {
  const socketContext = useContext<SocketContextType | undefined>(
    SocketContext
  );
  return (
    <div className="mt-10 text-black dark:text-white gap-5 flex flex-wrap items-center justify-center">
      <div className="flex flex-col items-center gap-2 ">
        <span className="font-semibold text-xl">You</span>
        <video
          className="h-96"
          playsInline
          muted
          autoPlay
          ref={socketContext?.localVideo}
        />
        {!socketContext?.call && <InititalControls />}
      </div>

      {socketContext?.call && (
        <div className="flex flex-col items-center gap-2 ">
          <span className="font-semibold text-xl">
            {socketContext.call?.callerName}
          </span>
          <video
            playsInline
            muted={socketContext.isVolume}
            autoPlay
            ref={socketContext?.remoteVideo}
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
