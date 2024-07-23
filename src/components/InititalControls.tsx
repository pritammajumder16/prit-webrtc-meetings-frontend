import { useContext } from "react";
import Camera from "../assets/svgComponents/Camera";
import Mic from "../assets/svgComponents/Mic";
import Button from "./ui/Button";
import { SocketContext } from "../context/MSocketContext";
import MicOff from "../assets/svgComponents/MicOff";
import CameraOff from "../assets/svgComponents/CameraOff";
import { SocketContextType } from "../types/interface";

const InititalControls = () => {
  const socketContext = useContext<SocketContextType | undefined>(
    SocketContext
  );
  return (
    <div className="flex gap-4 mt-2">
      <Button
        type="button"
        onClick={() => {
          socketContext?.toggleMute();
        }}
        className="flex items-center justify-center"
      >
        {socketContext?.isMuted ? <MicOff /> : <Mic />}
      </Button>
      <Button
        type="button"
        onClick={socketContext?.toggleVideo}
        className="flex items-center justify-center"
      >
        {socketContext?.isVideoOff ? <CameraOff /> : <Camera />}
      </Button>
    </div>
  );
};

export default InititalControls;
