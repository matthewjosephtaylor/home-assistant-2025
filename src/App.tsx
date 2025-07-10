import { Idbs } from "@mjt-engine/idb";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { AppConfig } from "./AppConfig";
import { darkTheme } from "./darkTheme";
import { ErrorBoundary } from "./ErrorBoundary";
import { globalStyles } from "./globalStyles";
import { onEscape } from "./onEscape";
import { SCREENS } from "./SCREENS";
import { useAppState } from "./state/AppState";
import { useScreen } from "./state/useScreen";
import { RoomScreen } from "./ui/room/RoomScreen";
import TopMenu from "./ui/TopMenu";

export const App = () => {
  const screen = useScreen();
  const screenComponent = screen ? SCREENS[screen] : <RoomScreen />;

  useEffect(() => {
    Idbs.get(AppConfig, "config").then((config) => {
      useAppState.getState().setUserDaimonId(config?.userDaimonId);
    });

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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
