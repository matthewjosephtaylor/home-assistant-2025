import { type Content } from "@mjt-services/daimon-common-2025";
import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { getBlobUrl } from "./getBlobUrl";

export const ContentImage = ({
  content,
  ...rest
}: { content?: Content } & Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "content"
>) => {
  const [src, setSrc] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!content) {
      setSrc(undefined);
      return;
    }
    const url = getBlobUrl(content);
    setSrc(url);
    return () => {
      // URL.revokeObjectURL(url);
    };
  }, [content]);

  return <img src={src} {...rest} />;
};
