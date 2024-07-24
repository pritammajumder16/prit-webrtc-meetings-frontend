/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { SocketContext } from "../context/SocketContext";
import Input from "./ui/Input";
import Button from "./ui/Button";
import Assignment from "../assets/svgComponents/Assignment";
import CallIcon from "../assets/svgComponents/Call";
import { SocketContextType } from "../types/interface";
const Options = ({ children }: { children: React.ReactNode }) => {
  const socketContext = useContext<SocketContextType | undefined>(
    SocketContext
  );
  const [idToCall, setIdToCall] = useState<string>("");

  return (
    <div className="h-full text-black dark:text-white max-w-[600px] flex flex-col gap-5 justify-center">
      {children}
      <div className="flex gap-6 flex-wrap w-full md:flex-row h-fit ">
        <form
          noValidate
          autoComplete="off"
          className="flex-1 flex flex-col gap-4 min-w-52"
        >
          <div className="font-semibold text-xl">
            <span className="whitespace-nowrap">Account Info</span>
          </div>
          <Input
            label={"Enter your name"}
            value={socketContext?.name}
            onChange={(e) => socketContext?.setName(e.target.value)}
          />
          <CopyToClipboard text={socketContext?.myUserId || ""}>
            <Button
              type="button"
              className="flex whitespace-nowrap items-center justify-center text-nowrap "
            >
              <Assignment />
              Copy your Room ID
            </Button>
          </CopyToClipboard>
        </form>
        <form
          noValidate
          autoComplete="off"
          className="flex-1 flex flex-col gap-4 min-w-52"
        >
          <div className="font-semibold text-xl">
            <span className="whitespace-nowrap">Make a call</span>
          </div>
          <Input
            label={"Enter Room ID"}
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />

          <Button
            type="button"
            onClick={() => {
              socketContext?.callUser(idToCall);
            }}
            disabled={!socketContext?.name || !idToCall}
            className="flex h-fit items-center justify-center whitespace-nowrap"
          >
            <CallIcon />
            Call
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Options;
