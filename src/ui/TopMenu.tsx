import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Slide,
} from "@mui/material";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
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
  // Track mouse movement and show/hide menu
  useEffect(() => {
    let hideTimeout: number | Timer | undefined;

    const handleMouseMove = () => {
      setVisible(true);
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => setVisible(false), 3000); // Hide after 3 seconds
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(hideTimeout);
    };
  }, []);

  return (
    <Slide in={visible} direction="down">
      <AppBar
        position="fixed"
        color="primary"
        sx={{ top: 0, left: 0, right: 0 }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <ButtonContainer>
            <Button
              onClick={() => {
                play();
              }}
            >
              Play
            </Button>
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
  );
};

export default TopMenu;
