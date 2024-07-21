/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { SocketContext } from "../context/socketContext";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { AssignmentIcon, CallEndIcon, CallIcon } from "../assets/staticIcons";
import { generateGuestName } from "../utils/generateGuestName";
const Options = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(SocketContext);
  const [name, setName] = useState<string>(generateGuestName());
  const [idToCall, setIdToCall] = useState<string>("");

  return (
    <div className="text-black mt-10 dark:text-white ">
      <div className="flex gap-6 flex-col flex-wrap w-full md:flex-row">
        <form
          noValidate
          autoComplete="off"
          className="flex-1 flex flex-col gap-4"
        >
          <div className="font-semibold text-xl">
            <span>Account Info</span>
          </div>
          <Input
            label={"Enter your name"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="">
            <span>Your ID is</span> <span>{context?.myUserId}</span>
          </div>
          <CopyToClipboard text={context?.myUserId || ""}>
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
          <div className="font-semibold text-xl">
            <span>Make a call</span>
          </div>
          <Input
            label={"Enter their ID"}
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
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
                context?.callUser(idToCall);
              }}
              disabled={!name || !idToCall}
              className="flex-1 flex items-center justify-center"
            >
              <img src={CallIcon} /> Call
            </Button>
          )}
        </form>
      </div>
      {children}
    </div>
  );
};

export default Options;
