import { Idb } from "@mjt-engine/idb";

export const AppConfig: Idb<{ authToken?: string; userDaimonId?: string }> = {
  dbName: "ha-2025",
  storeName: "config",
};
