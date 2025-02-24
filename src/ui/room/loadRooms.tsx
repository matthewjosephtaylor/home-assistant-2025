import { Errors } from "@mjt-engine/message";
import {
  CONTENT_OBJECT_STORE,
  ROOM_OBJECT_STORE,
  type Content,
  type Room,
} from "@mjt-services/daimon-common-2025";
import { Datas } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import type { TreeApi } from "../common/tree/TreeApi";
import type { TreeNode } from "../common/tree/TreeNode";
import { isEmpty, isUndefined } from "@mjt-engine/object";

export const loadRooms: TreeApi["loadChildren"] = async (
  parentId,
  query = ""
) => {
  try {
    console.log("loadRoomNodes", { parentId, query });
    const realizedQuery = isEmpty(query)
      ? "values(@)[?!parentId || parentId == `null`]"
      : query;
    const rooms = (await Datas.search(await getConnection())({
      from: ROOM_OBJECT_STORE,
      query: realizedQuery.trim(),
    })) as Room[];
    console.log("rooms", rooms);
    if (isUndefined(rooms)) {
      return [];
    }

    const treeNodes: TreeNode[] = await Promise.all(
      rooms.map(async (roomNode) => {
        const content = await Datas.get(await getConnection())<Content>({
          objectStore: CONTENT_OBJECT_STORE,
          key: roomNode.contentId,
        });

        return {
          id: roomNode.id,
          label: content?.value || "<missing>",
        } as TreeNode;
      })
    );
    return treeNodes;
  } catch (error) {
    // console.log("error", error);
    console.log(Errors.errorToText(error));
    throw error;
  }
};
