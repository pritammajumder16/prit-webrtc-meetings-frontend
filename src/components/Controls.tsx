import { useContext } from "react";
import Button from "./ui/Button";
import { SocketContext } from "../context/socketContext";
import {
  CallEndIcon,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  ShareScreen,
  StopShareScreen,
  Volume,
  VolumeOff,
} from "../assets/staticIcons";

const Controls = () => {
  const socketContext = useContext(SocketContext);
  return (
    <section className="flex gap-2 w-full items-center justify-center mt-5">
      <Button
        type="button"
        onClick={() => socketContext?.toggleMute()}
        className="flex items-center justify-center "
      >
        <img src={socketContext?.isMuted == false ? Mic : MicOff} />
      </Button>

      <Button
        type="button"
        onClick={() => socketContext?.toggleVideo()}
        className="flex items-center justify-center"
      >
        <img src={socketContext?.isVideoOff == false ? Camera : CameraOff} />
      </Button>

      <Button
        type="button"
        onClick={() => socketContext?.setIsVolume(!socketContext.isVolume)}
        className="flex items-center justify-center"
      >
        <img src={socketContext?.isVolume == false ? Volume : VolumeOff} />
      </Button>
      <Button
        type="button"
        onClick={() => socketContext?.toggleScreenShare()}
        className="flex items-center justify-center"
      >
        <img
          src={
            socketContext?.isShareScreen == false
              ? ShareScreen
              : StopShareScreen
          }
        />
      </Button>
      <Button
        type="button"
        onClick={socketContext?.leaveCall}
        className="flex items-center justify-center  dark:!bg-red-500 !bg-red-500"
      >
        <img src={CallEndIcon} />
      </Button>
    </section>
  );
};

export default Controls;
