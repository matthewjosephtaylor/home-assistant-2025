import { CssBaseline, ThemeProvider, createTheme, GlobalStyles } from "@mui/material";
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

const globalStyles = (
  <GlobalStyles
    styles={{
      "::-webkit-scrollbar": {
        width: "12px",
      },
      "::-webkit-scrollbar-track": {
        background: "#2c2c2c",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#888",
        borderRadius: "10px",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555",
      },
      "::-webkit-scrollbar-corner": {
        background: "#2c2c2c",
      },
      "html, body, #root": {
        height: "100%",
      },
      "*": {
        scrollbarColor: "#888 #2c2c2c",
        scrollbarWidth: "thin",
      },
    }}
  />
);

export const App = () => {
  const screen = useScreen();
  console.log("screen", screen);
  const screenComponent = screen ? SCREENS[screen] : <KioskScreen />;
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {globalStyles}
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