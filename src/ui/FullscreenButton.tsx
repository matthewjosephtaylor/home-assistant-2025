export const FullscreenButton = () => {
  const toggleFullscreen = () => {
    const element = document.documentElement; // Fullscreen the entire app
    if (!document.fullscreenElement) {
      element.requestFullscreen?.().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.error("Error attempting to exit full-screen mode:", err);
      });
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}
    >
      Toggle Fullscreen
    </button>
  );
};
