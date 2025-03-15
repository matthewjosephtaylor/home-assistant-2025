import { ROOM_OBJECT_STORE } from "@mjt-services/daimon-common-2025";
import { Ids } from "@mjt-services/data-common-2025";
import { useAppState } from "../../../state/AppState";
import type { TreeApi } from "../../common/tree/TreeApi";
import { loadRooms } from "../loadRooms";

export const loadRootTreeChildren: TreeApi["loadChildren"] = async (
  parentId,
  query
) => {
  const parsedId = parentId ? Ids.parse(parentId) : undefined;
  if (parsedId) {
    if (parsedId.type === ROOM_OBJECT_STORE.store) {
      useAppState.getState().setActiveNoteParentId(parentId);
      return loadRooms(parentId, `values(@)[?parentId == '${parentId}']`);
    }
  }
  return loadRooms(parentId, query);
};
