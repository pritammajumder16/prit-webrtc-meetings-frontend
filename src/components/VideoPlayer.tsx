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
      <div className="flex flex-col items-center  gap-2 md:h-[420px] md:w-96 w-full h-fit ">
        <span className="font-semibold text-xl">You</span>

        <video
          className="size-full "
          playsInline
          muted
          hidden={!socketContext?.localVideo || socketContext.isVideoOff}
          autoPlay
          controls
          ref={socketContext?.localVideo}
        />

        {(!socketContext?.localVideo || socketContext.isVideoOff) && (
          <div className="size-full flex items-center justify-center ">
            <div className="shadow-lg rounded-full flex items-center justify-center size-44 text-4xl font-semibold bg-gray-800 ">
              {socketContext?.name?.toUpperCase()[0]}
            </div>
          </div>
        )}

        {!socketContext?.call && !socketContext?.callAccepted && (
          <InititalControls />
        )}
      </div>

      {socketContext?.call && socketContext?.callAccepted && (
        <div className="flex flex-col items-center  gap-2 md:h-[420px] md:w-96  w-full h-fit ">
          <span className="font-semibold text-xl">
            {socketContext.call?.callerName}
          </span>
          <video
            className="size-full "
            playsInline
            muted={socketContext.isVolume}
            autoPlay
            ref={socketContext.remoteVideo}
          />

          {(!socketContext?.remoteVideo || socketContext.isVideoOff) && (
            <div className="size-full flex items-center justify-center ">
              <div className="shadow-lg rounded-full flex items-center justify-center size-44 text-4xl font-semibold bg-gray-800 ">
                {socketContext?.call?.callerName?.toUpperCase()[0] || "G"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
