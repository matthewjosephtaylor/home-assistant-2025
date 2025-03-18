import { isEmpty, isUndefined } from "@mjt-engine/object";
import {
  CONTENT_OBJECT_STORE,
  ROOM_OBJECT_STORE,
  type Content,
  type Room,
} from "@mjt-services/daimon-common-2025";
import { Datas } from "@mjt-services/data-common-2025";
import { getConnection } from "../../connection/Connections";
import type { TreeNode } from "../common/tree/TreeNode";

import { RoomContentView } from "./RoomContentView";

export const loadRooms = async (parentId: string | undefined, query = "") => {
  console.log(`loading :${parentId}`);
  const realizedQuery = isEmpty(query)
    ? "values(@)[?!parentId || parentId == `null`]"
    : query;
  const rooms = (await Datas.search(await getConnection())({
    from: ROOM_OBJECT_STORE,
    query: realizedQuery.trim(),
  })) as Room[];
  if (isUndefined(rooms)) {
    return [];
  }

  const treeNodes: TreeNode[] = await Promise.all(
    rooms.map(async (room) => {
      const content = await Datas.get(await getConnection())<Content>({
        objectStore: CONTENT_OBJECT_STORE,
        key: room.contentId,
      });

      return {
        id: room.id,
        parentId: room.parentId,
        label: content?.value || "<missing>",
        content: <RoomContentView room={room} />,
      } as TreeNode;
    })
  );
  return treeNodes;
};
