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
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 20,
        }}
      >
        <TopMenu />
      </Box>
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
        <Avatar3d
          canvasWidth={768}
          canvasHeight={1920}
          path={"fem.vrm"}
          style={{
            width: "100%", // Set width as needed
            height: "100vh", // Set height as needed
            backgroundImage: "url('monet.jpg')",
            backgroundSize: "auto", // Keeps the image at its natural size
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