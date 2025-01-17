import { Idbs } from "@mjt-engine/idb";
import { Messages } from "@mjt-engine/message";
import type { AsrConnectionMap } from "@mjt-services/asr-common-2025";
import type { TextgenConnectionMap } from "@mjt-services/textgen-common-2025";
import { AppConfig } from "../AppConfig";
import { GLOBALS } from "../GLOBALS";
import { useConnection } from "./useConnection";

export let _connection:
  | Awaited<ReturnType<typeof createConnection>>
  | undefined = undefined;

export const createConnection = async () => {
  const config = await Idbs.get(AppConfig, "config");
  const con = await Messages.createConnection<
    AsrConnectionMap & TextgenConnectionMap
  >({
    server: GLOBALS.mqUrl,
    options: { log: console.log },
    token: config?.authToken,
  });

  return con;
};

export const getConnection = async () => {
  if (!_connection) {
    _connection = await createConnection();
  }
  return _connection;
};
export const Connections = {
  getConnection,
  useConnection,
};
