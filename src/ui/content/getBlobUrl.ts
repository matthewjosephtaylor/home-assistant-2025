import { Bytes, type ByteLike } from "@mjt-engine/byte";
import type { Content } from "@mjt-services/daimon-common-2025";
import { CONTENT_IMAGE_CACHE } from "./CONTENT_IMAGE_CACHE";

export const getBlobUrl = (content: Content) => {
  const blob = Bytes.toBlob(content.value as ByteLike, content.contentType);
  const key = `${content.id}-${content.updatedAt}`;
  return CONTENT_IMAGE_CACHE.get(key, () => {
    // console.log("Creating blob url for", key);
    // console.log("Content", content);
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
