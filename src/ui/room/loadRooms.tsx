import { Errors } from "@mjt-engine/message";
import { ROOM_OBJECT_STORE, type Room } from "@mjt-services/daimon-common-2025";
import { Datas } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import type { TreeApi, TreeNode } from "../common/tree/Tree";


export const loadRooms: TreeApi["loadChildren"] = async (
  parentId,
  query = "values(@)"
) => {
  try {
    console.log("loadRoomNodes", parentId, query);
    const realizedQuery = query === "" ? "values(@)[?!parentId || parentId == `null`]" : query;
    const rooms = (await Datas.search(await getConnection())({
      from: ROOM_OBJECT_STORE,
      query: realizedQuery,
    })) as Room[];
    console.log("rooms", rooms);
    const treeNodes: TreeNode[] = rooms.map((roomNode) => ({
      id: roomNode.id,
      label: roomNode.content,
    }));
    return treeNodes;
  } catch (error) {
    // console.log("error", error);
    console.log(Errors.errorToText(error));
    throw error;
  }
};
