import { Idbs } from "@mjt-engine/idb";
import { Errors, Messages } from "@mjt-engine/message";
import type { AsrConnectionMap } from "@mjt-services/asr-common-2025";
import type { TextgenConnectionMap } from "@mjt-services/textgen-common-2025";
import { AppConfig } from "../AppConfig";
import { GLOBALS } from "../GLOBALS";
import { useConnection } from "./useConnection";
import type { DaimonConnectionMap } from "@mjt-services/daimon-common-2025";
import type { DataConnectionMap } from "@mjt-services/data-common-2025";
import type { ImagegenConnectionMap } from "@mjt-services/imagegen-common-2025";
import type { WebclientConnectionMap } from "@mjt-services/webclient-common-2025";
import { Caches } from "@mjt-engine/cache";

const CONNECTION_CACHE = Caches.create<ReturnType<typeof createConnection>>();

export const createConnection = async () => {
  const config = await Idbs.get(AppConfig, "config");
  const con = await Messages.createConnection<
    AsrConnectionMap &
      TextgenConnectionMap &
      DaimonConnectionMap &
      DataConnectionMap &
      ImagegenConnectionMap &
      WebclientConnectionMap
  >({
    server: GLOBALS.mqUrl,
    options: {
      log: (message, ...extra) => {
        console.log(Errors.errorToText(message), extra);
      },
    },
    token: config?.authToken,
  });

  return con;
};

export const getConnection = async () => {
  return CONNECTION_CACHE.get("connection", createConnection);
};


export const Connections = {
  getConnection,
  useConnection,
};
