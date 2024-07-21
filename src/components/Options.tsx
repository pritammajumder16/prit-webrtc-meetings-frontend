/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { SocketContext } from "../context/socketContext";
import Input from "./ui/Input";
const Options = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState<string>("");
  return (
    <div className="text-black mt-10 dark:text-white ">
      <div className="flex gap-6 ">
        <form noValidate autoComplete="off">
          <Input label={"Enter your name"} />
          Your ID is
        </form>
        <form></form>
      </div>
    </div>
  );
};

export default Options;
