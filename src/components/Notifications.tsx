import { useContext } from "react";
import Button from "./ui/Button";
import { SocketContext } from "../context/socketContext";
import { CallIcon } from "../assets/staticIcons";

const Notifications = () => {
  const context = useContext(SocketContext);
  return (
    <div className="text-black dark:text-white mt-5">
      {context?.call?.isReceivedCall && !context.callAccepted && (
        <div className="flex justify-center items-center">
          <span>{context?.call?.callerName}&nbsp;is calling:&nbsp;</span>
          <Button
            variant="primary"
            className="!bg-green-600"
            onClick={context.answerCall}
          >
            <img src={CallIcon} alt="" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
