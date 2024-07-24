/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { SocketContextType } from "../types/interface";
import InititalControls from "./InititalControls";
import Controls from "./Controls";

const VideoPlayer = () => {
  const socketContext = useContext<SocketContextType | undefined>(
    SocketContext
  );
  return (
    <div className="flex flex-1 flex-col  md:mt-10  text-black dark:text-white items-center justify-center">
      <div className="flex-1 flex-col sm:flex-row  gap-5 flex  items-center justify-center">
        <div className="flex flex-col items-center gap-1 w-full">
          <span className="font-semibold  md:text-xl">You</span>

          <video
            className="flex-1 "
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
        </div>

        {socketContext?.call && socketContext?.callAccepted && (
          <div className="flex flex-col items-center  gap-1 w-full ">
            <span className="font-semibold md:text-xl">
              {socketContext.call?.callerName}
            </span>
            <video
              className="flex-1 w-full  "
              playsInline
              muted={socketContext.isVolume}
              hidden={
                !socketContext?.remoteVideo ||
                !socketContext?.remotePeer.current?.streams?.[0].getVideoTracks()[0]
                  ?.enabled
              }
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
      {!socketContext?.callAccepted && socketContext?.callEnded && (
        <InititalControls />
      )}
      {socketContext?.call &&
        socketContext?.callAccepted &&
        socketContext?.callEnded && <Controls />}
    </div>
  );
};

export default VideoPlayer;
