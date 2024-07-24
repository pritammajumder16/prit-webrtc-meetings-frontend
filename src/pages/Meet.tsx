import { useContext } from "react";
import Header from "../components/Header";
import Notifications from "../components/Notifications";
import Options from "../components/Options";
import VideoPlayer from "../components/VideoPlayer";
import { SocketContext } from "../context/SocketContext";
import { SocketContextType } from "../types/interface";

const Meet = () => {
  const socketContext = useContext<SocketContextType | undefined>(
    SocketContext
  );
  return (
    <section className="flex flex-col md:px-10 md:py-14 py-2 px-6 dark:bg-darkBg bg-lightBg min-h-screen w-full bg-[linear-gradient(171deg,_rgba(217,216,216,1)_0%,_rgba(255,255,255,1)_55%)] dark:bg-[linear-gradient(315deg,#2b4162_0%,#12100e_74%)]">
      <Header></Header>
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <VideoPlayer />
        {(!socketContext?.call ||
          !socketContext.callAccepted ||
          !socketContext?.callEnded) && (
          <div className="flex-1 flex justify-center  ">
            <Options>
              <Notifications />
            </Options>
          </div>
        )}
      </div>
    </section>
  );
};

export default Meet;
