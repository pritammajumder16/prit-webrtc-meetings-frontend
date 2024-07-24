// components/ChatDrawer.tsx
import { useState, useContext, useEffect, useRef } from "react";
import { SocketContext } from "../context/SocketContext";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { Message, SocketContextType } from "../types/interface";
import Cancel from "../assets/svgComponents/Cancel";

const ChatDrawer = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const socketContext = useContext<SocketContextType | undefined>(
    SocketContext
  );
  const [message, setMessage] = useState<string>("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const sendMessage = () => {
    if (message.trim()) {
      socketContext?.sendMessage(message);
      setMessage("");
    }
  };
  useEffect(() => {
    if (chatEndRef.current)
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
  }, [socketContext?.messages]);

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 p-4 shadow-md transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Cancel
          className="cursor-pointer"
          onClick={() => setIsOpen((s) => !s)}
        />
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto mb-4 flex flex-col-reverse">
            {socketContext?.messages?.map((msg: Message, index: number) => (
              <div
                key={index}
                className={`mb-2 p-3 rounded-lg shadow-md ${
                  msg.from === socketContext?.name
                    ? "bg-blue-500 text-white dark:bg-blue-600 dark:text-gray-200 self-end ml-auto"
                    : "bg-gray-200 text-black dark:bg-gray-700 dark:text-gray-300 self-start mr-auto"
                }`}
                style={{ maxWidth: "75%" }}
              >
                <div className="text-sm">
                  <span className="font-semibold">{msg.from}</span>
                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                    {new Date(msg.time).toLocaleTimeString()}
                  </span>
                </div>
                <div className=" break-words">{msg.message}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="flex gap-2 my-4 items-end">
            <Input
              label={"Type your message"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              containerClassName="flex-1"
            />
            <Button type="button" onClick={sendMessage} className="h-fit">
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatDrawer;
