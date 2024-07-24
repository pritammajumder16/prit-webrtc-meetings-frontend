import { useContext, useState } from "react";
import Button from "./ui/Button";
import { SocketContext } from "../context/SocketContext";
import ScreenShare from "../assets/svgComponents/ScreenShare";
import StopScreenShare from "../assets/svgComponents/StopScreenshare";
import CallEnd from "../assets/svgComponents/CallEnd";
import Volume from "../assets/svgComponents/Volume";
import VolumeOff from "../assets/svgComponents/VolumeOff";
import CameraOff from "../assets/svgComponents/CameraOff";
import Camera from "../assets/svgComponents/Camera";
import MicOff from "../assets/svgComponents/MicOff";
import Mic from "../assets/svgComponents/Mic";
import { SocketContextType } from "../types/interface";
import ChatIcon from "../assets/svgComponents/ChatIcon";
import ChatDrawer from "./ChatDrawer";

const Controls = () => {
  const socketContext = useContext<SocketContextType | undefined>(
    SocketContext
  );
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section className="flex flex-wrap gap-2 w-full items-center justify-center mt-5">
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => socketContext?.toggleMute()}
          className="flex items-center justify-center "
        >
          {socketContext?.isMuted == false ? <Mic /> : <MicOff />}
        </Button>
        <Button
          type="button"
          onClick={() => socketContext?.toggleVideo()}
          className="flex items-center justify-center"
        >
          {socketContext?.isVideoOff == false ? <Camera /> : <CameraOff />}
        </Button>
        <Button
          type="button"
          onClick={() => socketContext?.setIsVolume(!socketContext.isVolume)}
          className="flex items-center justify-center"
        >
          {socketContext?.isVolume == false ? <Volume /> : <VolumeOff />}
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => socketContext?.toggleScreenShare()}
          className="flex items-center justify-center"
        >
          {socketContext?.isShareScreen == false ? (
            <ScreenShare />
          ) : (
            <StopScreenShare />
          )}
        </Button>{" "}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center"
        >
          <ChatIcon />
        </Button>
        <ChatDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
        <Button
          type="button"
          onClick={socketContext?.leaveCall}
          className="flex items-center justify-center  dark:!bg-red-500 !bg-red-500"
        >
          <CallEnd />
        </Button>
      </div>
    </section>
  );
};

export default Controls;
