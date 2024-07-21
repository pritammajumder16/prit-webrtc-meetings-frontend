const VideoPlayer = () => {
  return (
    <div className="text-black dark:text-white">
      <div>
        <video playsInline muted autoPlay />
      </div>
      <div>
        <video playsInline autoPlay />
      </div>
    </div>
  );
};

export default VideoPlayer;
