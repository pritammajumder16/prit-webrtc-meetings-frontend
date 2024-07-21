import { useContext, useState } from "react";
import Button from "./ui/Button";
import { SocketContext } from "../context/socketContext";
import {
  CallEndIcon,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Volume,
  VolumeOff,
} from "../assets/staticIcons";

const Controls = () => {
  const context = useContext(SocketContext);
  const [muted, setMuted] = useState<boolean>(false);
  const [camera, setCamera] = useState<boolean>(false);
  const [volume, setVolume] = useState<boolean>(false);
  return (
    <section className="flex gap-2 w-full items-center justify-center mt-5">
      {muted == false ? (
        <Button
          type="button"
          onClick={() => setMuted(!muted)}
          className="flex items-center justify-center"
        >
          <img src={Mic} />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={() => setMuted(!muted)}
          className="flex items-center justify-center"
        >
          <img src={MicOff} />
        </Button>
      )}
      {camera == false ? (
        <Button
          type="button"
          onClick={() => setCamera(!camera)}
          className="flex items-center justify-center"
        >
          <img src={Camera} />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={() => setCamera(!camera)}
          className="flex items-center justify-center"
        >
          <img src={CameraOff} />
        </Button>
      )}
      {volume == false ? (
        <Button
          type="button"
          onClick={() => setVolume(!volume)}
          className="flex items-center justify-center"
        >
          <img src={Volume} />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={() => setVolume(!volume)}
          className="flex items-center justify-center"
        >
          <img src={VolumeOff} />
        </Button>
      )}
      <Button
        type="button"
        onClick={context?.leaveCall}
        className="flex items-center justify-center  !bg-red-500"
      >
        <img src={CallEndIcon} />
      </Button>
    </section>
  );
};

export default Controls;
