import type { DaimonCharaCard } from "@mjt-services/daimon-common-2025";
import type { TavernCardV1 } from "./TavernCardV1";
import { isWithSpec } from "./isWithSpec";

export const objectToDaimonCharaCard = (obj: object): DaimonCharaCard => {
  if (isWithSpec(obj) && obj["spec"] === "chara_card_v2") {
    return obj as DaimonCharaCard;
  }
  const v1 = obj as TavernCardV1;
  return {
    spec: "chara_card_v2",
    spec_version: "2.0",
    data: {
      ...v1,
    },
  };
};
