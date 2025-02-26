import { Bytes, type ByteLike } from "@mjt-engine/byte";
import type { Content } from "@mjt-services/daimon-common-2025";
import { useEffect, useState, type ImgHTMLAttributes } from "react";

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
    const blob = Bytes.toBlob(content.value as ByteLike, content.contentType);
    const url = URL.createObjectURL(blob);
    setSrc(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [content]);

  return <img src={src} {...rest} />;
};
