import { isDefined, isUndefined } from "@mjt-engine/object";
import { ChatLangs } from "../../chatlang/ChatLangs";
import type { TreeApi } from "../common/tree/TreeApi";
import { addUserRoomTextContent } from "./addUserRoomTextContent";
import { TEXT_ENTRY_EVALUATOR } from "./TEXT_ENTRY_EVALUATOR";
import { linkDaimonToRoom } from "./linkDaimonToRoom";
import { useAppState } from "../../state/AppState";
import { Datas } from "@mjt-services/data-common-2025";
import {
  ROOM_OBJECT_STORE,
  type Content,
  type Room,
} from "@mjt-services/daimon-common-2025";
import { getConnection } from "../../connection/Connections";

export const handleTextEntry = async ({
  text,
  treeApi,
}: {
  text: string;
  treeApi: TreeApi;
}) => {
  console.log("handleTextEntry", text);
  const out = await ChatLangs.interpretText(
    text,
    TEXT_ENTRY_EVALUATOR(treeApi)
  );
  console.log("out", out);
  const activeRoomParentId = treeApi.getActiveNoteParentId();
  if (isUndefined(activeRoomParentId)) {
    return;
  }
  const { userDaimonId } = useAppState.getState();
  if (isDefined(userDaimonId)) {
    await linkDaimonToRoom({
      daimonId: userDaimonId,
      roomId: activeRoomParentId,
    });
  }

  // if there is a parent room make sure to link the creator to the room
  const activeRoomParent = (await Datas.get(await getConnection())({
    key: activeRoomParentId,
  })) as Room;
  console.log("activeRoomParent", activeRoomParent);
  const activeRoomContent = (await Datas.get(await getConnection())({
    key: activeRoomParent.contentId,
  })) as Content;
  console.log("activeRoomParentContent", activeRoomContent);

  // TODO perhaps the search on the daimon side wants to just assume this link instead of creating?
  if (isDefined(activeRoomContent.creatorId)) {
    await linkDaimonToRoom({
      daimonId: activeRoomContent.creatorId,
      roomId: activeRoomParentId,
    });
  }

  const roomId = await addUserRoomTextContent({
    text: out,
    parentId: activeRoomParentId,
  });

  console.log("roomId", roomId);
};
