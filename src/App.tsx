import { Avatar3d } from "@mjtdev/avatar-3d";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const App = () => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Avatar3d
      canvasWidth={768}
      canvasHeight={1920}
      path={"fem.vrm"}
      style={{
        // backgroundColor: "purple",
        // border: "1px solid white",
        // maxWidth: "768",
        // maxHeight: "1024",
        width: '100%',        // Set width as needed
        height: '100vh',      // Set height as needed
        backgroundImage: "url('monet.jpg')",
        backgroundSize: 'auto',         // Keeps the image at its natural size
        // backgroundPosition: 'center',   // Centers the image
        backgroundRepeat: 'no-repeat',  // Prevents tiling
        overflow: 'hidden',             // Hides any overflow content
      }}
      vrmCameraOptions={{
        frustumSize: 1.5,

      }}
      animationPath="Idle_2.fbx"
    />
  </ThemeProvider>
);
