import { Messages } from "@mjt-engine/message";
import {
  isChildObject,
  type DATA_EVENT_MAP,
} from "@mjt-services/data-common-2025";
import { useEffect, useState } from "react";
import { useConnection } from "../../../connection/useConnection";
import { useAppState } from "../../../state/AppState";
import { loadRootTreeChildren } from "../../room/root-tree/loadRootTreeChildren";
import type { TreeNode } from "./TreeNode";
import { isDefined } from "@mjt-engine/object";

export const useTreeNodes = ({
  parentId,
  search,
}: {
  parentId?: string;
  search: string;
}): TreeNode[] => {
  const connectionInstance = useConnection();
  const [children, setChildren] = useState<TreeNode[]>([]);

  const realizeChildren = async (
    parentId: string | undefined,
    search: string
  ) => {
    useAppState.getState().setActiveRoomId(parentId);
    return loadRootTreeChildren(parentId, search);
  };
  useEffect(() => {
    const abortController = new AbortController();
    if (!connectionInstance) {
      return;
    }
    Messages.connectEventListenerToSubjectRoot<
      "update",
      typeof DATA_EVENT_MAP,
      Record<string, string>
    >({
      connection: connectionInstance.connection,
      subjectRoot: isDefined(parentId) ? "child_update" : "object_update",
      signal: abortController.signal,
      listener: async (event) => {
        const { subject, detail } = event;
        const { root, subpath } = Messages.parseSubject(subject);
        if (isDefined(parentId)) {
          if (subpath !== parentId) {
            return;
          }
          const children = await realizeChildren(subpath, search);
          setChildren(children);
        } else {
          // if (isChildObject(detail)) {
          //   return;
          // }
          // const children = await realizeChildren(parentId, search);
          // setChildren(children);
        }
      },
    });
    realizeChildren(parentId, search).then((result) => {
      setChildren(result);
    });
    return () => {
      abortController.abort();
    };
  }, [connectionInstance, parentId, search]);

  return children;
};
