/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { SocketContext } from "../context/socketContext";
import { SocketContextType } from "../types/interface";

const VideoPlayer = () => {
  const context = useContext<SocketContextType | undefined>(SocketContext);
  return (
    <div className="text-black dark:text-white">
      {context?.stream && (
        <div>
          <video playsInline muted autoPlay ref={context?.myVideo} />
        </div>
      )}
      {context?.callAccepted && !context?.callEnded && (
        <div>
          <video playsInline autoPlay ref={context?.userVideo} />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
