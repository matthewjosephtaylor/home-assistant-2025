import type { Daimon } from "@mjt-services/daimon-common-2025";


export const sortDaimonsByLastUsed = (a: Daimon, b: Daimon) => {
  const aLastUsedMaybe = a.chara.data.extensions?.lastUsed;
  const bLastUsedMaybe = b.chara.data.extensions?.lastUsed;
  if (aLastUsedMaybe && bLastUsedMaybe) {
    return bLastUsedMaybe - aLastUsedMaybe;
  }
  if (aLastUsedMaybe) {
    return -1;
  }
  if (bLastUsedMaybe) {
    return 1;
  }
  return 0;
};
