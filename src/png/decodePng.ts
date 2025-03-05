import { decodePng } from "@lunapaint/png-codec";
import { Bytes, type ByteLike } from "@mjt-engine/byte";

export type DecodedPng = {
  meta: {
    width: number;
    height: number;
    bitDepth: number;
  };
  textChunks: Record<string, string>;
  data: ArrayBuffer;
};
export const bytesToDecodedPng = async (
  bytes: ByteLike
): Promise<DecodedPng> => {
  const data = await Bytes.toArrayBuffer(bytes);
  const decoded = await decodePng(new Uint8Array(data), {
    parseChunkTypes: "*",
  });
  console.log(decoded);
  const textChunks = decoded.metadata
    .filter((chunk) => chunk.type === "tEXt")
    .reduce(
      (acc, chunk) => {
        const textAb = Bytes.base64ToArrayBuffer(chunk.text);
        const utf8 = Bytes.arrayBufferToUtf8(textAb);
        acc[chunk.keyword] = utf8;
        return acc;
      },
      {} as Record<string, string>
    );
  return {
    meta: decoded.details,
    textChunks,
    data,
  };
};
