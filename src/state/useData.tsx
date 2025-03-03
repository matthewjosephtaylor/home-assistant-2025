import { isUndefined } from "@mjt-engine/object";
import {
  Datas,
  search,
  type DATA_EVENT_MAP,
} from "@mjt-services/data-common-2025";
import { useState, useEffect } from "react";
import { getConnection } from "../connection/Connections";
import { useConnection } from "../connection/useConnection";
import { Messages } from "@mjt-engine/message";

export const useData = <T extends object>({ id }: { id?: string }) => {
  const connectionInstance = useConnection();
  const [data, setData] = useState<T | undefined>(undefined);

  const update = async (id?: string) => {
    if (isUndefined(id)) {
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
        // console.log(`object_update: subject ${id}: ${id} `, subject);
        const { root, subpath } = Messages.parseSubject(subject);
        if (subpath !== id) {
          console.log(`BAD object_update: subpath ${id}: ${subpath} `, subpath);
          return;
        }
        console.log(`object_update for ${id}`, { root, subpath });
        console.log(`object_update: detail: ${id} `, detail);
        // const children = await realizeChildren(subpath, search);
        // setChildren(children);
      },
    });
    // realizeChildren(parentId, search).then((result) => {
    //   setChildren(result);
    // });
    return () => {
      abortController.abort();
    };
  }, [connectionInstance, id]);
  return data;
};
