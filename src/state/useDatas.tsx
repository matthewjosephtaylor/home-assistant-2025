import { Messages } from "@mjt-engine/message";
import { isUndefined } from "@mjt-engine/object";
import {
  type DATA_EVENT_MAP,
  type ObjectStore,
  Datas,
  Ids,
} from "@mjt-services/data-common-2025";
import { useEffect, useState } from "react";
import { getConnection } from "../connection/Connections";
import { useConnection } from "../connection/useConnection";

export const useDatas = <T extends object>({
  query = "values(@)",
  from,
}: {
  query?: string;
  from: ObjectStore<T>;
}) => {
  const connectionInstance = useConnection();
  const [data, setData] = useState<T[]>([]);

  const update = async (query: string, from: ObjectStore) => {
    const result = (await Datas.search(await getConnection())({
      query,
      from,
    })) as T[];
    setData(result);
  };

  useEffect(() => {
    update(query, from);
  }, [query, from]);

  useEffect(() => {
    const abortController = new AbortController();
    if (!connectionInstance) {
      return;
    }
    Messages.connectEventListenerToSubjectRoot<
      "object_update",
      typeof DATA_EVENT_MAP,
      Record<string, string>
    >({
      connection: connectionInstance.connection,
      subjectRoot: `object_update`,
      signal: abortController.signal,
      listener: async (event) => {
        const { subject, detail } = event;
        const { root, subpath } = Messages.parseSubject(subject);
        const parsed = Ids.parse(subpath);
        if (isUndefined(parsed)) {
          return;
        }
        const { type, namespace } = parsed;
        if (type === from.store) {
          update(query, from);
        }
      },
    });
    return () => {
      abortController.abort();
    };
  }, [connectionInstance, query, from]);
  return data;
};
