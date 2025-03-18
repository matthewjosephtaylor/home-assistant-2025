import { isDefined } from "@mjt-engine/object";
import { ROOM_OBJECT_STORE } from "@mjt-services/daimon-common-2025";
import { Ids } from "@mjt-services/data-common-2025";
import { loadRooms } from "../loadRooms";

export const loadRootTreeChildren = async (
  parentId: string | undefined,
  query: string
) => {
  const parsedId = parentId ? Ids.parse(parentId) : undefined;
  if (isDefined(parsedId)) {
    if (parsedId.type === ROOM_OBJECT_STORE.store) {
      return loadRooms(parentId, `values(@)[?parentId == '${parentId}']`);
    }
  }
  return loadRooms(parentId, query);
};
