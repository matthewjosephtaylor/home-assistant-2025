import type { Daimon } from "@mjt-services/daimon-common-2025";
import type { DaimonCrud } from "./DaimonCrud";


export const daimonToDaimonCrud = (userDaimonId?: string) => (daimon: Daimon) => ({
  id: daimon.id,
  isUser: daimon.id === userDaimonId,
  image: daimon.chara.data.extensions?.avatar,
  model: daimon.chara.data.extensions?.llm,
  ...daimon.chara.data,
}) satisfies DaimonCrud;
