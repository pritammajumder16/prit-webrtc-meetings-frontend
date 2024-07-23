/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { SocketContext } from "../context/MSocketContext";
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
    <div className="text-black mt-10 dark:text-white max-w-[600px]">
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
            value={socketContext?.name}
            onChange={(e) => socketContext?.setName(e.target.value)}
          />
          <CopyToClipboard text={socketContext?.myUserId || ""}>
            <Button
              type="button"
              className="flex-1 flex items-center justify-center text-nowrap whitespace-nowrap"
            >
              <Assignment />
              Copy your ID
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

          <Button
            type="button"
            onClick={() => {
              socketContext?.callUser(idToCall);
            }}
            disabled={!socketContext?.name || !idToCall}
            className="flex h-fit items-center justify-center"
          >
            <CallIcon />
            Call
          </Button>
        </form>
      </div>
      {children}
    </div>
  );
};

export default Options;
