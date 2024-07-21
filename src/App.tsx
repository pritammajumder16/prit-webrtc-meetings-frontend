import Header from "./components/Header";
import VideoPlayer from "./components/VideoPlayer";
import Options from "./components/Options";
import Notifications from "./components/Notifications";

function App() {
  return (
    <section className=" px-10 py-14 dark:bg-darkBg bg-lightBg min-h-screen w-full bg-[linear-gradient(171deg,_rgba(217,216,216,1)_0%,_rgba(255,255,255,1)_55%)] dark:bg-[linear-gradient(315deg,#2b4162_0%,#12100e_74%)]">
      <Header></Header>
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options>
    </section>
  );
}

export default App;
