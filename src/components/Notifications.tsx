import { useContext } from "react";
import Button from "./ui/Button";
import { SocketContext } from "../context/socketContext";

const Notifications = () => {
  const context = useContext(SocketContext);
  return (
    <div className="text-black dark:text-white">
      {context?.call?.isReceivedCall && !context.callAccepted && (
        <div className="flex justify-center">
          <span>{context?.call?.name}&nbsp; is calling:</span>
          <Button variant="primary" onClick={context.answerCall}>
            Answer
          </Button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
