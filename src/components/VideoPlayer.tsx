/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useRef } from "react";
import { SocketContext } from "../context/SocketContext";
import { SocketContextType } from "../types/interface";
import InititalControls from "./InititalControls";

const VideoPlayer = () => {
  const socketContext = useContext<SocketContextType | undefined>(
    SocketContext
  );
  return (
    <div className="mt-10 text-black dark:text-white gap-5 flex flex-wrap items-center justify-center">
      <div className="flex flex-col items-center  gap-2 h-[420px] w-96 ">
        <span className="font-semibold text-xl">You</span>

        <video
          className="h-96 w-96 shadow-lg rounded-lg"
          playsInline
          muted
          hidden={!socketContext?.localVideo || socketContext.isVideoOff}
          autoPlay
          controls
          ref={socketContext?.localVideo}
        />

        {(!socketContext?.localVideo || socketContext.isVideoOff) && (
          <div className="h-96 w-96 flex items-center justify-center ">
            <div className="shadow-lg rounded-full flex items-center justify-center size-44 text-4xl font-semibold bg-gray-800 ">
              {socketContext?.name?.toUpperCase()[0]}
            </div>
          </div>
        )}

        {!socketContext?.call && !socketContext?.callAccepted && (
          <InititalControls />
        )}
      </div>

      {socketContext?.call && !socketContext?.callAccepted && (
        <div className="flex flex-col items-center  gap-2 h-[420px] w-96 ">
          <span className="font-semibold text-xl">
            {socketContext.call?.callerName}
          </span>
          <video
            className="h-96 w-96 shadow-lg rounded-lg"
            playsInline
            muted={socketContext.isVolume}
            autoPlay
            ref={socketContext.remoteVideo}
          />
          <div className="h-96 w-96 flex items-center justify-center border-4 border-green-500 shadow-lg rounded-lg bg-gray-800 text-white">
            {(!socketContext?.localVideo || socketContext.isVideoOff) && (
              <div className="h-96 w-96 flex items-center justify-center ">
                <div className="shadow-lg rounded-full flex items-center justify-center size-44 text-4xl font-semibold bg-gray-800 ">
                  {socketContext?.call?.callerName?.toUpperCase()[0] || "G"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
