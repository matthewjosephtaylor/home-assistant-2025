import { ROOM_OBJECT_STORE } from "@mjt-services/daimon-common-2025";
import { Ids } from "@mjt-services/data-common-2025";
import type React from "react";
import type { TreeApi } from "../../common/tree/TreeApi";
import type { TreeNode } from "../../common/tree/TreeNode";
import { loadDaimons } from "../loadDaimons";
import { loadRooms } from "../loadRooms";


export const loadRootTreeChildren: TreeApi["loadChildren"] = async (
  parentId,
  query
) => {
  if (parentId === "daimons") {
    return loadDaimons(parentId, query);
  }
  if (parentId === "rooms") {
    return loadRooms(parentId, query);
  }
  const parsedId = parentId ? Ids.parse(parentId) : undefined;
  if (parsedId) {
    if (parsedId.type === ROOM_OBJECT_STORE.store) {
      return loadRooms(parentId, `values(@)[?parentId == '${parentId}']`);
    }
  }
  if (!parentId) {
    return [
      {
        id: "daimons",
        content: <>Daimons</>,
      },
      {
        id: "rooms",
        content: <>Rooms</>,
      },
    ] as TreeNode[];
  }
  return [];
};
