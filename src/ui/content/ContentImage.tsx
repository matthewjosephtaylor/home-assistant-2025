import { type Content } from "@mjt-services/daimon-common-2025";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { getBlobUrl } from "./getBlobUrl";

export const ContentImage = ({
  content,
  onAbort,
  ...rest
}: { content?: Content; onAbort?: () => void } & Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "content"
>) => {
  const [src, setSrc] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!content || !content?.value) {
      setSrc(undefined);
      return;
    }
    const url = getBlobUrl(content);
    setSrc(url);
    return () => {
      // URL.revokeObjectURL(url);
    };
  }, [content]);
  if (!src) {
    return <></>;
  }
  if (!content?.finalized) {
    return (
      <Box position="relative">
        <img src={src} {...rest} />
        <CircularProgress
          onClick={() => onAbort?.()}
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            zIndex: 10,
          }}
        />
      </Box>
    );
  }

  return <img src={src} {...rest} />;
};
