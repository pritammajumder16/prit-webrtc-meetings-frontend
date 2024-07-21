import { useContext } from "react";
import Header from "../components/Header";
import Notifications from "../components/Notifications";
import Options from "../components/Options";
import VideoPlayer from "../components/VideoPlayer";
import { SocketContext } from "../context/socketContext";
import Controls from "../components/Controls";

const Meet = () => {
  const socketContext = useContext(SocketContext);
  return (
    <section className=" px-10 py-14 dark:bg-darkBg bg-lightBg min-h-screen w-full bg-[linear-gradient(171deg,_rgba(217,216,216,1)_0%,_rgba(255,255,255,1)_55%)] dark:bg-[linear-gradient(315deg,#2b4162_0%,#12100e_74%)]">
      <Header></Header>
      <VideoPlayer />
      {socketContext?.call &&
      socketContext.callAccepted &&
      !socketContext?.callEnded ? (
        <Controls />
      ) : (
        <Options>
          <Notifications />
        </Options>
      )}
    </section>
  );
};

export default Meet;
