import { Avatar3d } from "@mjtdev/avatar-3d";
import { PhonemeLevelsDisplay, Vads } from "@mjtdev/vad-2025";
import { Button, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { play } from "./play";
import { ConfigButton } from "./ConfigButton";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
export const App = () => {
  const [active, setActive] = useState(false);
  const analyserNode = Vads.useMicAudio(active);
  // console.log("PhonemeLevelsDisplay", PhonemeLevelsDisplay);
  // console.log("analyzerNode", analyserNode);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack direction={"row"} spacing={2}>
        <Button
          onClick={() => {
            play();
          }}
        >
          Play
        </Button>
        <ConfigButton />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            console.log("Start button clicked");
            setActive((a) => !a);
            // getMicrophoneInput();
            // startVad();
          }}
        >
          Microphone {active ? "on" : "off"}
        </Button>
      </Stack>
      <Stack direction={"row"} spacing={2}>
        {analyserNode && <PhonemeLevelsDisplay analyserNode={analyserNode} />}
        <Avatar3d
          canvasWidth={768}
          canvasHeight={1920}
          path={"fem.vrm"}
          style={{
            // backgroundColor: "purple",
            // border: "1px solid white",
            // maxWidth: "768",
            // maxHeight: "1024",
            width: "100%", // Set width as needed
            height: "100vh", // Set height as needed
            backgroundImage: "url('monet.jpg')",
            backgroundSize: "auto", // Keeps the image at its natural size
            // backgroundPosition: 'center',   // Centers the image
            backgroundRepeat: "no-repeat", // Prevents tiling
            overflow: "hidden", // Hides any overflow content
          }}
          vrmCameraOptions={{
            frustumSize: 1.5,
          }}
          animationPath="Idle_2.fbx"
        />
      </Stack>
    </ThemeProvider>
  );
};
