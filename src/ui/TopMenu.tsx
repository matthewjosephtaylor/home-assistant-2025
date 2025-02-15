import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Slide,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import CancelIcon from "@mui/icons-material/Cancel";
import { Idbs } from "@mjt-engine/idb";
import { AppConfig } from "../AppConfig";
import { play } from "../play";
import { QRCodeHandler } from "../qr/QRCodeHandler";
import { QRCodeScanner } from "../qr/QRCodeScanner";
import { CameraButton } from "./CameraButton";
import { ConfigButton } from "./ConfigButton";
import { FullscreenButton } from "./FullscreenButton";
import { MicrophoneButton } from "./MicrophoneButton";

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
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleMenu}>
          <MenuIcon />
        </IconButton>
      )}
      <Slide in={visible} direction="down">
        <AppBar position="fixed" color="primary" sx={{ top: 0, left: 0, right: 0 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="cancel" onClick={toggleMenu}>
              <CancelIcon />
            </IconButton>
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
        </AppBar>
      </Slide>
    </>
  );
};

export default TopMenu;