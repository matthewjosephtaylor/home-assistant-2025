import type { Content } from "@mjt-services/daimon-common-2025";
import { Update } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import { GenerateImageDialog } from "../common/GenerateImageDialog";
import { ContentImage } from "./ContentImage";
import type { TextToImageRequest } from "@mjt-services/imagegen-common-2025";

export const GenContentImage = ({
  onUpdate,
  defaultRequest,
  ...rest
}: {
  onUpdate?: (value: Content) => void;
  defaultRequest?: Partial<TextToImageRequest>;
} & Parameters<typeof ContentImage>[0]) => {
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        style={{ position: "relative", display: "inline-block" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {rest.content ? (
          <ContentImage {...rest} />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "grey.300",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            No Image
          </Box>
        )}
        {onUpdate && isHovered && (
          <IconButton
            onClick={() => setOpen(true)}
            style={{
              position: "absolute",
              bottom: "0px",
              right: "0px",
              zIndex: 10,
            }}
          >
            <Update />
          </IconButton>
        )}
      </Box>
      <GenerateImageDialog
        open={open}
        value={rest.content}
        defaultRequest={defaultRequest}
        onClose={() => setOpen(false)}
        onSave={async (value) => {
          onUpdate?.(value);
          setOpen(false);
        }}
      />
    </>
  );
};
