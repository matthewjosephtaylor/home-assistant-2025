import type { DaimonCharaCard } from "@mjt-services/daimon-common-2025";


export type DaimonCrud = DaimonCharaCard["data"] & {
  id: string;
  image?: string;
  model?: string;
  isUser?: boolean;
};
