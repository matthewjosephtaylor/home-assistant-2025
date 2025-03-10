import { Bytes, type ByteLike } from "@mjt-engine/byte";
import { type Content } from "@mjt-services/daimon-common-2025";
import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { CONTENT_IMAGE_CACHE } from "./CONTENT_IMAGE_CACHE";

export const getBlobUrl = (content: Content) => {
  const blob = Bytes.toBlob(content.value as ByteLike, content.contentType);
  const key = `${content.id}-${content.updatedAt}`;
  return CONTENT_IMAGE_CACHE.get(key, () => {
    const url = URL.createObjectURL(blob);
    setTimeout(
      () => {
        CONTENT_IMAGE_CACHE.delete(key);
        URL.revokeObjectURL(url);
      },
      60 * 10 * 1000
    );
    return url;
  });
};

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
