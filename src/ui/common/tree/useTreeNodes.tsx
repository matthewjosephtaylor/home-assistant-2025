import { Messages } from "@mjt-engine/message";
import type { DATA_EVENT_MAP } from "@mjt-services/data-common-2025";
import { useState, useEffect } from "react";
import { useConnection } from "../../../connection/useConnection";
import type { TreeApi } from "./TreeApi";
import type { TreeNode } from "./TreeNode";

export const useTreeNodes = ({
  treeApi,
  parentId,
  search,
}: {
  treeApi: TreeApi;
  parentId?: string;
  search: string;
}): TreeNode[] => {
  const connectionInstance = useConnection();
  const [children, setChildren] = useState<TreeNode[]>([]);

  const realizeChildren = async (
    parentId: string | undefined,
    search: string
  ) => {
    return treeApi.loadChildren(parentId, search);
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
      subjectRoot: "update",
      signal: abortController.signal,
      listener: async (event) => {
        const { root, subpath } = Messages.parseSubject(event.subject);
        if (subpath !== parentId) {
          return;
        }
        const children = await realizeChildren(subpath, search);
        setChildren(children);
      },
    });
    realizeChildren(parentId, search).then((result) => {
      setChildren(result);
    });
    return () => {
      abortController.abort();
    };
  }, [connectionInstance, parentId, search, treeApi]);

  return children;
};
