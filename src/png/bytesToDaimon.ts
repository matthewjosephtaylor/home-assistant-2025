import type { ByteLike } from "@mjt-engine/byte";
import { isUndefined } from "@mjt-engine/object";
import {
  type Daimon,
  DAIMON_OBJECT_STORE,
} from "@mjt-services/daimon-common-2025";
import { Ids, Datas } from "@mjt-services/data-common-2025";
import { getConnection } from "../connection/Connections";
import { bytesToContentId } from "../ui/daimon/fileToContentId";
import { bytesToDecodedPng } from "./decodePng";
import { objectToDaimonCharaCard } from "./objectTodiamonCharaCard";

export const bytesToDaimon = async (bytes: ByteLike): Promise<Daimon> => {
  const decoded = await bytesToDecodedPng(bytes);
  const charaString = decoded.textChunks["chara"];
  if (isUndefined(charaString)) {
    throw new Error("No chara chunk found");
  }
  const obj = JSON.parse(charaString);
  const chara = objectToDaimonCharaCard(obj);
  const contentId = await bytesToContentId(bytes);
  chara.data.extensions = {
    ...chara.data.extensions,
    avatar: contentId,
    lastUsed: Date.now(),
  };
  const daimon: Daimon = {
    chara,
    id: Ids.fromObjectStore(DAIMON_OBJECT_STORE),
  };

  await Datas.put(await getConnection())({
    value: daimon,
  });

  return daimon;
};
