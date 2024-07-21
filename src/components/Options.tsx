/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useMemo, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { SocketContext } from "../context/socketContext";
import Input from "./ui/Input";
import { generateUniqueId } from "../utils/generateUniqueId";
import Button from "./ui/Button";
import { AssignmentIcon, CallEndIcon, CallIcon } from "../assets/staticIcons";
const Options = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState<string>("");
  const uniqueId = useMemo(() => {
    return generateUniqueId();
  }, []);
  return (
    <div className="text-black mt-10 dark:text-white ">
      <div className="flex gap-6 flex-col flex-wrap w-full md:flex-row">
        <form
          noValidate
          autoComplete="off"
          className="flex-1 flex flex-col gap-4"
        >
          <div className="">
            <span>Account Info</span>
          </div>
          <Input label={"Enter your name"} />

          <div className="">
            <span>Your ID is</span> <span>{uniqueId}</span>
          </div>
          <CopyToClipboard text={uniqueId}>
            <Button
              type="button"
              className="flex-1 flex items-center justify-center text-nowrap whitespace-nowrap"
            >
              <img src={AssignmentIcon} /> Copy to clipboard{" "}
            </Button>
          </CopyToClipboard>
        </form>
        <form
          noValidate
          autoComplete="off"
          className="flex-1 flex flex-col gap-4"
        >
          <div className="">
            <span>Make a call</span>
          </div>
          <Input label={"Enter their ID"} />
          {context?.callAccepted && !context.callEnded ? (
            <Button
              type="button"
              onClick={context.leaveCall}
              className="flex-1 flex items-center justify-center"
            >
              <img src={CallEndIcon} /> Hang up
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => {
                context?.callUser("");
              }}
              className="flex-1 flex items-center justify-center"
            >
              <img src={CallIcon} /> Call
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Options;
