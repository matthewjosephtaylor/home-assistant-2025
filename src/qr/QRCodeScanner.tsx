import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { BrowserQRCodeReader } from "@zxing/library";

export const QRCodeScanner = ({
  onScan,
}: {
  onScan: (value: string) => void;
}) => {
  const [decodedText, setDecodedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoElementId = "qr-video";

  const startScanning = async () => {
    try {
      const codeReader = new BrowserQRCodeReader();
      setIsScanning(true);

      const videoInputDevices = await codeReader.listVideoInputDevices();

      if (videoInputDevices.length === 0) {
        throw new Error("No camera devices found.");
      }

      const selectedDeviceId = videoInputDevices[0].deviceId;

      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoElementId,
        (result, error) => {
          if (result) {
            setDecodedText(result.getText());
            setIsScanning(false);
            codeReader.reset(); // Stop the scanner after a successful read
            onScan(result.getText());
          }

          if (error) {
            // console.error("Decoding error:", error);
            setError("Unable to decode QR code. Try again.");
          }
        }
      );
    } catch (err: any) {
      // console.error("Error starting QR code scanner:", err);
      setError(err.message || "An unknown error occurred.");
    }
  };

  const stopScanning = () => {
    const codeReader = new BrowserQRCodeReader();
    codeReader.reset();
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanning(); // Cleanup scanner on component unmount
    };
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Camera QR Code Scanner
      </Typography>

      <Box sx={{ mb: 2 }}>
        <video
          id={videoElementId}
          style={{ width: "100%", border: "1px solid #ccc" }}
          autoPlay
          muted
        />
      </Box>

      {isScanning ? (
        <Button variant="contained" color="error" onClick={stopScanning}>
          Stop Scanning
        </Button>
      ) : (
        <Button variant="contained" onClick={startScanning}>
          Start Scanning
        </Button>
      )}

      {decodedText && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Decoded Text: {decodedText}
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          Error: {error}
        </Typography>
      )}
    </Box>
  );
};
