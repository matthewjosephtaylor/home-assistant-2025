import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Box } from "@mui/system";
import TopMenu from "./ui/TopMenu";

import { KioskScreen } from "./kiosk/KioskScreen";
import { SCREENS } from "./SCREENS";
import { useScreen } from "./state/useScreen";
import { ErrorBoundary } from "./ErrorBoundary";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const App = () => {
  const screen = useScreen();
  console.log("screen", screen);
  const screenComponent = screen ? SCREENS[screen] : <KioskScreen />;
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ErrorBoundary>
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
        {screenComponent}
      </ErrorBoundary>
    </ThemeProvider>
  );
};
