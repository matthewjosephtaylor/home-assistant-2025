import { Idbs } from "@mjt-engine/idb";
import CancelIcon from "@mui/icons-material/Cancel";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Button, IconButton, Slide, Toolbar } from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import { AppConfig } from "../AppConfig";
import { play } from "../play";
import { QRCodeHandler } from "../qr/QRCodeHandler";
import { QRCodeScanner } from "../qr/QRCodeScanner";
import { CameraButton } from "./CameraButton";
import { ConfigButton } from "./ConfigButton";
import { FullscreenButton } from "./FullscreenButton";
import { MicrophoneButton } from "./MicrophoneButton";
import { HorizontalMenu } from "./common/HorizontalMenu";
import { Objects } from "@mjt-engine/object";
import { SCREENS } from "../SCREENS";
import { useAppState } from "../state/AppState";

export const SectionMenu = ({
  onAction,
}: {
  onAction?: (action: keyof typeof SCREENS) => void;
}) => {
  const actions = Object.fromEntries(
    Objects.keys(SCREENS).map((label) => [
      label,
      () => {
        useAppState.getState().setUrlHash(label);
        onAction?.(label);
      },
    ])
  );
  return <HorizontalMenu actions={actions} />;
};

// Styled container for flowing buttons
const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  overflow: "hidden",
}));

const TopMenu = () => {
  const [visible, setVisible] = useState(false);

  const toggleMenu = () => {
    setVisible(!visible);
  };

  return (
    <>
      {!visible && (
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleMenu}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Slide in={visible} direction="down">
        <AppBar
          position="fixed"
          color="primary"
          sx={{ top: 0, left: 0, right: 0 }}
        >
          <SectionMenu onAction={() => setVisible(false)} />
          <Toolbar>
            <ButtonContainer>
              <Button onClick={() => play()}>Play</Button>
              <ConfigButton />
              <FullscreenButton />
              <MicrophoneButton />
              <CameraButton />
              <QRCodeScanner
                onScan={(value) => {
                  Idbs.update(AppConfig, "config", (config) => ({
                    ...config,
                    authToken: value,
                  }));
                }}
              />
              <QRCodeHandler />
            </ButtonContainer>
          </Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="cancel"
            onClick={toggleMenu}
          >
            <CancelIcon />
          </IconButton>
        </AppBar>
      </Slide>
    </>
  );
};

export default TopMenu;
