import type { MessageConnectionInstance } from "@mjt-engine/message/dist/createConnection";
import {
  type DataConnectionMap,
  type Entity,
  type ObjectStore,
  Ids,
  Datas,
} from "@mjt-services/data-common-2025";

/** @deprecated */
export const putEntity =
  <C extends DataConnectionMap>(con: MessageConnectionInstance<C>) =>
  <T extends Entity>(store: ObjectStore<T>) =>
  async (draft: Partial<T>) => {
    const { id = Ids.fromObjectStore(store), ...rest } = draft;
    return Datas.put(con)({
      value: {
        id,
        ...rest,
      } as Partial<T>,
    });
  };
