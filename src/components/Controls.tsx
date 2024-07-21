import { useContext } from "react";
import Button from "./ui/Button";
import { SocketContext } from "../context/socketContext";
import { CallEndIcon } from "../assets/staticIcons";

const Controls = () => {
  const context = useContext(SocketContext);
  return (
    <section>
      <Button
        type="button"
        onClick={context?.leaveCall}
        className="flex-1 flex items-center justify-center  !bg-red-500"
      >
        <img src={CallEndIcon} />
      </Button>
      <Button
        type="button"
        onClick={context?.leaveCall}
        className="flex-1 flex items-center justify-center"
      >
        <img src={CallEndIcon} /> Hang up
      </Button>
    </section>
  );
};

export default Controls;
