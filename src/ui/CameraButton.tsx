import { Button, Box } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";

export const CameraButton: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    const enableCamera = async () => {
      if (isCameraActive && videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          console.log("Stream:", stream);
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
          };
          console.log("Video stream assigned:", stream);
        } catch (err) {
          console.error("Error accessing camera:", err);
          setCameraActive(false);
        }
      }
    };

    enableCamera();
  }, [isCameraActive]);

  return (
    <Box>
      <Button variant="contained" onClick={() => setCameraActive(true)}>
        Enable Camera {isCameraActive ? "✅" : "❌"}
      </Button>
      {isCameraActive && (
        <Box mt={2}>
          <video ref={videoRef} style={{ width: "100%", maxWidth: "300px" }} />
        </Box>
      )}
    </Box>
  );
};