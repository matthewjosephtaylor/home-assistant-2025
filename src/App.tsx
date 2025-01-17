import { Avatar3d } from "@mjtdev/avatar-3d";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import StreamingText from "./ui/StreamingText";
import TopMenu from "./ui/TopMenu";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
export const App = () => {
  // const analyserNode = Vads.useMicAudio(active);
  // console.log("PhonemeLevelsDisplay", PhonemeLevelsDisplay);
  // console.log("analyzerNode", analyserNode);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <TopMenu />
      <Stack direction={"row"} spacing={2}></Stack>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}
      >
        <StreamingText />
      </Box>
      <Stack direction={"row"} spacing={2}>
        {/* {analyserNode && <PhonemeLevelsDisplay analyserNode={analyserNode} />} */}
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
