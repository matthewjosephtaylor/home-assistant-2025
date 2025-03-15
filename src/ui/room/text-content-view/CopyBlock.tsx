import React from "react";
import { Box, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export const CopyBlock = ({
  children,
  text,
}: {
  text: string;
  children: React.ReactNode;
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        "&:hover .copy-button": {
          opacity: 1,
        },
      }}
    >
      <IconButton
        onClick={(evt) => {
          evt.stopPropagation();
          navigator.clipboard.writeText(text);
        }}
        className="copy-button"
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          opacity: 0,
          transition: "opacity 0.3s",
        }}
      >
        <ContentCopyIcon />
      </IconButton>
      {children}
    </Box>
  );
};