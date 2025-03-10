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
    <Box sx={{ position: "relative" }}>
      <IconButton
        onClick={(evt) => {
          evt.stopPropagation();
          navigator.clipboard.writeText(text);
        }}
        sx={{ position: "absolute", top: 0, right: 0 }}
      >
        <ContentCopyIcon />
      </IconButton>
      {children}
    </Box>
  );
};
