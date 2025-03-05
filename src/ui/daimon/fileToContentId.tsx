import {
  type Content,
  CONTENT_OBJECT_STORE,
} from "@mjt-services/daimon-common-2025";
import { Ids, Datas } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import { Bytes, type ByteLike } from "@mjt-engine/byte";

export const bytesToContentId = async (bytes: ByteLike, creatorId?: string) => {
  const contentType =
    bytes instanceof File
      ? bytes.type
      : bytes instanceof Blob
        ? bytes.type
        : "application/octet-stream";
  const ab = await Bytes.toArrayBuffer(bytes);
  const content: Content = {
    id: Ids.fromObjectStore(CONTENT_OBJECT_STORE),
    contentType,
    value: ab,
    createdAt: Date.now(),
    creatorId,
    finalized: true,
  };
  await Datas.put(await getConnection())({
    value: content,
  });
  return content.id;
};
