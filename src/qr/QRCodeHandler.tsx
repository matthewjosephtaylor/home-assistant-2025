import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import QRCode from 'qrcode';
import { BrowserQRCodeReader } from '@zxing/library';

export const QRCodeHandler: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [qrCodeData, setQRCodeData] = useState('');
  const [decodedText, setDecodedText] = useState('');

  // Generate QR Code
  const generateQRCode = async () => {
    try {
      const qrCode = await QRCode.toDataURL(inputText);
      setQRCodeData(qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  // Decode QR Code from Image
  const decodeQRCode = async (file: File) => {
    try {
      const codeReader = new BrowserQRCodeReader();
      const result = await codeReader.decodeFromImage(file);
      setDecodedText(result.getText());
    } catch (error) {
      console.error('Error decoding QR code:', error);
      setDecodedText('Failed to decode QR code.');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        QR Code Generator & Reader
      </Typography>

      {/* QR Code Generator */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Generate a QR Code
        </Typography>
        <TextField
          label="Text to Encode"
          variant="outlined"
          fullWidth
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={generateQRCode}>
          Generate QR Code
        </Button>
        {qrCodeData && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Generated QR Code:</Typography>
            <img src={qrCodeData} alt="Generated QR Code" style={{ marginTop: '10px', maxWidth: '100%' }} />
          </Box>
        )}
      </Box>

      {/* QR Code Reader */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Decode a QR Code
        </Typography>
        <Button variant="contained" component="label">
          Upload QR Code Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                decodeQRCode(file);
              }
            }}
          />
        </Button>
        {decodedText && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Decoded Text: {decodedText}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

