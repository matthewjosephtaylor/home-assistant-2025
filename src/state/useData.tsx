import { Messages } from "@mjt-engine/message";
import { isUndefined } from "@mjt-engine/object";
import {
  Datas,
  Ids,
  type DATA_EVENT_MAP,
} from "@mjt-services/data-common-2025";
import { useEffect, useState } from "react";
import { getConnection } from "../connection/Connections";
import { useConnection } from "../connection/useConnection";

export const useData = <T extends object>(id?: string) => {
  const connectionInstance = useConnection();
  const [data, setData] = useState<T | undefined>(undefined);

  const update = async (id?: string) => {
    if (isUndefined(id) || isUndefined(Ids.parse(id))) {
      setData(undefined);
      return;
    }
    const result = await Datas.get(await getConnection())<T>({ key: id });
    setData(result);
  };

  useEffect(() => {
    update(id);
  }, [id]);

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
        if (subpath !== id) {
          return;
        }

        setData(detail as T);
      },
    });
    return () => {
      abortController.abort();
    };
  }, [connectionInstance, id]);
  return data;
};
